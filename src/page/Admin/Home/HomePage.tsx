import styles from "./styles.module.scss";
import TitlePage from "@/shared/components/titlePage/TitlePage";
import AnalyticCard from "@/shared/components/analyticCard/AnalyticCard";
import {
  IoCheckboxOutline,
  IoChevronDown,
  IoChevronUp,
  IoEye,
  IoWallet,
} from "react-icons/io5";
import { FaAdversal, FaRegUser } from "react-icons/fa6";
import { OverviewChart } from "@/shared/components/overviewChart/OverviewChart";
import OverviewRankSong from "@/shared/components/overviewRankSong/OverviewRankSong";
import { useEffect, useState } from "react";
import { getProfile, getStats } from "@/service/authService";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PuffLoader from "react-spinners/PuffLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Payment from "@/page/Payment/Payment";
const HomePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchSongs = async () => {
    try {
      const resProfile = await getProfile();
      const resStats = await getStats();
      setProfileData(resProfile);
      setStatsData(resStats);

      // Handle the response here
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSongs().then(() => {
      setIsLoading(false);
    });
  }, []);

  const totalViews = statsData?.totalViews || 0;
  const totalAds = statsData?.totalAds || 0;
  const quotaRemaining = statsData?.quotaRemaining || 0;
  const pendingAmount = statsData?.pendingAmount || 0;

  return (
    <div className={styles.container}>
      <Card className="fixed w-[85%] top-0 right-[1%] z-50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b transition-all duration-300">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center p-4">
            {isLoading ? (
              <Skeleton className="h-6 w-1/3" />
            ) : (
              <h2 className="text-2xl font-bold">
                Current Bundle: {profileData?.adBundle.name}
              </h2>
            )}
            <div className="flex gap-2">
              <Dialog
                open={showPaymentModal}
                onOpenChange={setShowPaymentModal}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <IoWallet size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh]">
                  <DialogTitle>Purchase Views</DialogTitle>
                  <DialogDescription>
                    Add more views to your bundle
                  </DialogDescription>
                  <Payment />
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <IoChevronDown size={20} />
                ) : (
                  <IoChevronUp size={20} />
                )}
              </Button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-0 ${
              isCollapsed ? "h-0" : "h-auto p-6 pt-0"
            }`}
          >
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  {profileData?.adBundle.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Quota:
                      </span>
                      <p className="text-lg font-semibold">
                        {profileData?.adBundle.quota} views
                      </p>
                    </div>
                    {/* <div>
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <p className="text-lg font-semibold">${profileData?.adBundle.price}</p>
                    </div> */}
                  </div>
                  <div className="flex flex-col items-end capitalize">
                    <Badge
                      variant={
                        profileData?.adBundle.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {profileData?.adBundle.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Created:{" "}
                      {new Date(
                        profileData?.adBundle.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className={`${isCollapsed ? "pt-[80px]" : "pt-[200px]"}`}>
        <TitlePage title={["Overview", "Dashboard"]} />

        <section className={styles["analytic-section"]}>
          {isLoading ? (
            Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="p-6 rounded-lg shadow-md">
                  <PuffLoader size={40} />
                </div>
              ))
          ) : (
            <>
              <AnalyticCard
                iconColor="#4CAF50"
                icon={FaAdversal}
                title="Total Ads"
                mainNumber={totalAds}
                unit="Unit(s)"
              />
              <AnalyticCard
                iconColor="#2196F3"
                icon={IoEye}
                title="Total Views"
                mainNumber={totalViews}
                unit="View(s)"
              />

              <AnalyticCard
                iconColor="#FFC107"
                icon={FaRegUser}
                title="Quota Remaining"
                mainNumber={quotaRemaining}
                unit="View(s) left"
              />
              <AnalyticCard
                iconColor="#673AB7"
                icon={IoCheckboxOutline}
                title="Pending Ad Requests"
                mainNumber={pendingAmount}
                unit="Unit(s)"
              />
            </>
          )}
        </section>

        <section className={styles["metrics-section"]}>
          <div className={styles["chart-section"]}>
            <TitlePage title={["Total Views per Month"]} />
            <OverviewChart />
          </div>

          <div className={styles["top-section"]}>
            <TitlePage title={["Top Songs"]} />
            <OverviewRankSong />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
