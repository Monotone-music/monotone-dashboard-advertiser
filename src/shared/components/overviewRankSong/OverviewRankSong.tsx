import styles from "./styles.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getTop } from "@/service/authService";
import { PuffLoader } from "react-spinners";

const OverviewRankSong = () => {
  const { data: topAds, isLoading } = useQuery({
    queryKey: ['topAds'],
    queryFn: getTop
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <PuffLoader color="black" />
      </div>
    );
  }

  return (
    <div className={styles["outer-container"]}>
      <div className={styles.container}>
        <Table>
          <TableHeader className="h-16 font-bold bg-slate-100">
            <TableRow>
              <TableHead className="text-black w-[200px] font-bold">Ad Title</TableHead>
              <TableHead className="font-bold text-black">Type</TableHead>
              <TableHead className="font-bold text-black">Status</TableHead>
              <TableHead className="text-right text-black font-bold">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAds?.map((ad: {
              _id: string
              title: string
              type: string
              status: string
              view: number
            }) => (
              <TableRow key={ad._id} className="h-20">
                <TableCell className="font-medium truncate max-w-[200px]">{ad.title}</TableCell>
                <TableCell className="capitalize">{ad.type.replace('_', ' ')}</TableCell>
                <TableCell className="capitalize">{ad.status}</TableCell>
                <TableCell className="text-right">{ad.view}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OverviewRankSong;
