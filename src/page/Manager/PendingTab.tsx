import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PuffLoader } from 'react-spinners'
import { useToast } from '@/hooks/use-toast'
import { cancelPendingReq, getByStatus } from '@/service/managerService'

const PendingTab = () => {
  const [req, setReq] = useState({ player_ad: [], banner_ad: [] })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReq()
  }, [])

  const fetchReq = async () => {
    try {
      const data = await getByStatus('pending')
      setReq(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelPendingReq(id)
      toast({
        title: "Advertisement cancelled",
        description: "Your advertisement request has been cancelled",
        className: "bg-green-500 text-white",
      })
      fetchReq()
    } catch (error) {
        console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel advertisement",
        className: "bg-red-500 text-white",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><PuffLoader /></div>
  }

  const allAds = [...req.player_ad, ...req.banner_ad]

  if (allAds.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500">
        No pending advertisements found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Submitted Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAds.map((ad: { _id: string; title: string; type: string; createdAt: string }) => (
          <TableRow key={ad._id}>
            <TableCell>{ad.title}</TableCell>
            <TableCell>{ad.type}</TableCell>
            <TableCell>{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button 
                variant="destructive" 
                onClick={() => handleCancel(ad._id)}
              >
                Cancel Request
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PendingTab
