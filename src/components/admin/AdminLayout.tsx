import { useState } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, ClipboardList, BookOpen, Image, ShoppingBag, Users, SlidersHorizontal, LogOut, Menu, X } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Enquiries", icon: ClipboardList, path: "/admin/enquiries" },
  { label: "Courses Manager", icon: BookOpen, path: "/admin/courses" },
  { label: "Gallery Manager", icon: Image, path: "/admin/gallery" },
  { label: "Products Manager", icon: ShoppingBag, path: "/admin/products" },
  { label: "Faculty Manager", icon: Users, path: "/admin/faculty" },
  { label: "Site Settings", icon: SlidersHorizontal, path: "/admin/site-settings" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = navItems.find((n) => location.pathname.startsWith(n.path))?.label || "Dashboard";

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 flex flex-col items-start gap-2">
        <img src={logoWhite} alt="Javani" className="h-24 w-auto object-contain" />
        <span className="inline-block px-3 py-1 rounded text-[0.7rem] font-body text-white/70 bg-white/10 tracking-widest uppercase">Admin</span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-[0.875rem] transition-all duration-200 ${
                isActive
                  ? "text-gold bg-gold/[0.12] border-l-[3px] border-gold"
                  : "text-white/60 hover:text-gold hover:bg-gold/[0.08] border-l-[3px] border-transparent"
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="font-body text-[0.75rem] text-white/40 truncate mb-2">{user?.email}</p>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-md font-body text-[0.8rem] text-white/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed left-0 top-0 bottom-0 z-[100] overflow-y-auto" style={{ background: "#1A0A0A" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] flex flex-col" style={{ background: "#1A0A0A" }}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-ivory/97 backdrop-blur-sm shadow-sm border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-semibold text-[1.3rem] text-foreground">{currentPage}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-body font-bold text-[0.75rem]">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden sm:inline font-body text-[0.85rem] text-foreground">{user?.email?.split("@")[0]}</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
