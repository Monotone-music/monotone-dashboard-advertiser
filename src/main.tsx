import { createRoot } from "react-dom/client";
import "./index.scss";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthPage from "./page/Auth/AuthPage";
import { Toaster } from "./components/ui/toaster";
import RootLayout from "./layout/Root/RootLayout";
import HomePage from "./page/Admin/Home/HomePage";
import AccountsManagement from "./page/Admin/Accounts/AccountsManagement";
import ArtistAccount from "./page/Admin/Accounts/Artist/ArtistAccount";
import UploaderPage from "./page/Uploader/UploaderPage";
import Payment from "./page/Payment/Payment";
import { useEffect } from "react";
import { setNavigate } from "./service/apiClient";
// import router from "./util/Router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/sign-in" replace />,
  },
  {
    path: "/auth/sign-in",
    element: <NavigationWrapper><AuthPage /></NavigationWrapper>,
  },
  {
    path: "/adver",
    element: <NavigationWrapper><RootLayout /></NavigationWrapper>,
    children: [
      { path: "overview", element: <HomePage /> },
      {
        path: "accounts-management",
        element: <AccountsManagement />,
        children: [{ path: "artist", element: <ArtistAccount /> }],
      },
      { path: "uploader", element: <UploaderPage/> },
      { path: "payment", element: <Payment /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
);
