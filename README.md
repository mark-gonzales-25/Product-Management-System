import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import AdminRoute from '../components/AdminRoute'
import ProductsPage from './ProductsPage'
import DeletedPage from './DeletedPage'
import AdminPage from './AdminPage'
import ProductReportPage from './ProductReportPage'
import TopSellingPage from './TopSellingPage'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen" style={{ paddingLeft: 'var(--sidebar-w)' }}>
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6" style={{ paddingTop: 'calc(var(--topbar-h) + 1.5rem)' }}>
          <Routes>
            <Route path="products"              element={<ProductsPage />} />
            <Route
              path="deleted"
              element={
                <AdminRoute>
                  <DeletedPage />
                </AdminRoute>
              }
            />
            <Route path="reports/products"      element={<ProductReportPage />} />
            <Route path="reports/top-selling"   element={<TopSellingPage />} />
            <Route path="admin"                 element={<AdminPage />} />
            <Route path="*"                     element={<Navigate to="products" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
