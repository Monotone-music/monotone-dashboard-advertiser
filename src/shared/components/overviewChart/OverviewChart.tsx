import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getChart } from "@/service/authService"

const chartConfig = {
  desktop: {
    label: "Views",
    color: "#4CAF50",
  }
} satisfies ChartConfig

export function OverviewChart() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getChart()
        // Transform API data to match chart format
        const transformedData = response.map((item: any) => ({
          month: new Date(2024, item.month - 1).toLocaleString('default', { month: 'long' }),
          desktop: item.totalViews
        }))
        setChartData(transformedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    fetchChartData()
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          dataKey="desktop"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
