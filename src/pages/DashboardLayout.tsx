import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ProductsPage from './ProductsPage'
import DeletedPage from './DeletedPage'
import ProductReportPage from './ProductReportPage'
import TopSellingPage from './TopSellingPage'
import AdminPage from './AdminPage'

export default function DashboardLayout() {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar />
        <main className="flex-1 p-6 px-7 bg-gray-50">
          <Routes>
            <Route path="products"            element={<ProductsPage />} />
            <Route path="deleted"             element={<DeletedPage />} />
            <Route path="reports/products"    element={<ProductReportPage />} />
            <Route path="reports/top-selling" element={<TopSellingPage />} />
            <Route path="admin"               element={<AdminPage />} />
            <Route path="*"                   element={<Navigate to="products" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
