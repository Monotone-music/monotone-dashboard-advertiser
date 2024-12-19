import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PuffLoader } from 'react-spinners'
import { getByStatus } from '@/service/managerService'

const RejectedTab = () => {
  const [req, setReq] = useState({ player_ad: [], banner_ad: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const data = await getByStatus('rejected')
      setReq(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><PuffLoader /></div>
  }

  const allAds = [...req.player_ad, ...req.banner_ad]

  if (allAds.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500">
        No rejected advertisements found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Rejection Date</TableHead>
          {/* <TableHead>Reason</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAds.map((ad: any) => (
          <TableRow key={ad._id}>
            <TableCell>{ad.title}</TableCell>
            <TableCell>{ad.type}</TableCell>
            <TableCell>{new Date(ad.updatedAt).toLocaleDateString()}</TableCell>
            {/* <TableCell>
              <Badge variant="destructive">
                {ad.rejectionReason || 'No reason provided'}
              </Badge>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RejectedTab
