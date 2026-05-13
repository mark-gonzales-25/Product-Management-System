import { NavLink } from 'react-router-dom'
import {
  Package, Trash2, FileText, TrendingUp, Users
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  privileged?: boolean
}

function NavItem({ to, icon, label, privileged = false }: NavItemProps) {
  const { profile } = useAuth()
  const role = profile?.user_type ?? 'USER'
  if (privileged && role === 'USER') return null

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-[13.5px] cursor-pointer transition-all select-none ${
          isActive
            ? 'bg-[#6c5ce7] text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <span className="w-[18px] flex-shrink-0 flex items-center justify-center">{icon}</span>
      {label}
    </NavLink>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-widest text-white/30 uppercase">
      {label}
    </div>
  )
}

export default function Sidebar() {
  return (
    <nav
      className="fixed top-0 left-0 bottom-0 z-50 flex flex-col text-white"
      style={{ width: 'var(--sidebar-w)', background: 'var(--navy)' }}
    >
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.08]">
        <div className="text-[17px] font-bold flex items-center gap-2">
          MLR-AZ
          <span className="bg-[#6c5ce7] rounded-md px-2 py-0.5 text-[11px] font-semibold">PMS</span>
        </div>
        <div className="text-[11px] text-white/30 mt-0.5">Internal System</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <SectionLabel label="Main" />
        <NavItem to="/app/products"  icon={<Package size={15} />}         label="Products" />
        <NavItem to="/app/deleted"   icon={<Trash2 size={15} />}          label="Deleted Items" privileged />

        <SectionLabel label="Reports" />
        <NavItem to="/app/reports/products"    icon={<FileText size={15} />}    label="Product Report" />
        <NavItem to="/app/reports/top-selling" icon={<TrendingUp size={15} />}  label="Top Selling" privileged />

        <SectionLabel label="System" />
        <NavItem to="/app/admin" icon={<Users size={15} />} label="User Management" privileged />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.08] text-[11px] text-white/30">
        © 2024 MLR-AZ v1.0
      </div>
    </nav>
  )
}
