import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TitlePage from "@/shared/components/titlePage/TitlePage"
import ActiveTab from "./ActiveTab"
import PendingTab from "./PendingTab"
import RejectedTab from "./RejectedTab"


const ManagerPage = () => {
  return (
    <div className="w-full p-8 flex flex-col gap-8">
      <TitlePage title={["Advertisement", "Manager"]} />
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Ads</TabsTrigger>
          <TabsTrigger value="pending">Pending Ads</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ActiveTab />
        </TabsContent>
        
        <TabsContent value="pending">
          <PendingTab />
        </TabsContent>
        
        <TabsContent value="rejected">
          <RejectedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerPage
