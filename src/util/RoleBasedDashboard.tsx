import HomePage from "@/page/Admin/Home/HomePage";
import HomeArtist from "@/page/Artist/Home/HomeArtist";
import {useAuthStore} from "@/store/useAuthStore";
import React from "react";
import { useParams, Navigate } from "react-router-dom";


const RoleBasedDashboard: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const user = useAuthStore((state) => state.user);

  // Redirect if the role in the URL doesn’t match the authenticated user’s role
  if (user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the appropriate dashboard component based on the role
  switch (role) {
    case "artist":
      return <HomeArtist />;
    // case "musicLabel":
    //   return <MusicLabelDashboard />;
    case "admin":
      return <HomePage />;
    // case "advertiser":
    //   return <AdvertiserDashboard />;
    // case "distributor":
    //   return <DistributorDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleBasedDashboard;
