import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PuffLoader } from "react-spinners";
import { getByStatus, updateStatus } from "@/service/managerService";
import { useToast } from "@/hooks/use-toast";

const ActiveTab = () => {
  const [req, setReq] = useState({ player_ad: [], banner_ad: [] });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReqs();
  }, []);

  const fetchReqs = async () => {
    try {
      const data = await getByStatus("active");
      setReq(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateStatus(id);
      toast({
        title: "Status updated",
        description: "Advertisement status has been updated successfully",
        className: "bg-green-500 text-white",
      });
      fetchReqs();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update advertisement status",
        className: "bg-red-500 text-white",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <PuffLoader />
      </div>
    );
  }

  const allAds = [...req.player_ad, ...req.banner_ad];

  if (allAds.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500">
        No pending advertisements found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAds.map(
          (key: {
            _id: string;
            title: string;
            type: string;
            view: number;
            status: string;
          }) => (
            <TableRow key={key._id}>
              <TableCell>{key.title}</TableCell>
              <TableCell>{key.type}</TableCell>
              <TableCell>{key.view}</TableCell>
              <TableCell>
                <Switch
                  checked={key.status === "active"}
                  onCheckedChange={() => handleStatusChange(key._id)}
                  disabled={updatingId === key._id}
                  className="data-[state=checked]:bg-green-500"
                />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default ActiveTab;
