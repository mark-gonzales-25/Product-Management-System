import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { SalesDetail, Product } from '../lib/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function TopSellingPage() {
  const [sales,    setSales]    = useState<SalesDetail[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('sales_detail').select('*'),
      supabase.from('products').select('*'),
    ]).then(([s, p]) => {
      setSales(s.data ?? [])
      setProducts(p.data ?? [])
      setLoading(false)
    })
  }, [])

  const topMap: Record<string, number> = {}
  ;(sales ?? []).forEach(s => { topMap[s.product_code] = (topMap[s.product_code] ?? 0) + s.quantity })
  const sorted = Object.entries(topMap).sort((a, b) => b[1] - a[1]).slice(0, 10)

  const labels = sorted.map(([code]) => {
    const p = (products ?? []).find(pr => pr.code === code)
    return p ? p.description.slice(0, 22) : code
  })

  const barData = {
    labels,
    datasets: [{
      label: 'Units Sold',
      data: sorted.map(x => x[1]),
      backgroundColor: 'rgba(108,92,231,0.8)',
      borderRadius: 6,
    }],
  }

  const opts = {
    responsive: true, maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
          <TrendingUp size={15} className="text-[#6c5ce7]" /> Top 10 by Total Units Sold
        </div>
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <div className="spinner" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : (
          <div style={{ position: 'relative', height: 380 }}>
            <Bar data={barData} options={opts} />
          </div>
        )}
      </div>
    </div>
  )
}
