// router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/layout/Root/RootLayout";
import Unauthorized from "@/page/Unauthorized/Unauthorized";
import HomePage from "@/page/Admin/Home/HomePage";
import Profile from "@/page/Admin/Profile/Profile";
import AuthPage from "@/page/Auth/AuthPage";
import AccountsManagement from "@/page/Admin/Accounts/AccountsManagement";
import ArtistAccount from "@/page/Admin/Accounts/Artist/ArtistAccount";
import ArtistDetail from "@/page/Admin/Accounts/Artist/ArtistDetail/ArtistDetail";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/sign-in" replace />, // Redirect root path to /auth/sign-in
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: (
        <RootLayout />
    ),
    children: [
      { path: "overview", element: <HomePage /> },
      {
        path: "accounts-management",
        element: <AccountsManagement />,
        children: [
          { path: "artist", element: <ArtistAccount />,
            children: [
              {
                path: ":id",
                element: <ArtistDetail />,
              },
            ],
           },
        ],
      },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <Navigate to="/auth/sign-in" replace />, // Redirect any undefined routes to /auth/sign-in
  },
]);

export default router;
