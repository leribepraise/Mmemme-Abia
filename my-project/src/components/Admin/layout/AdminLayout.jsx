import { Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from '@/components/context/AuthContext';
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import PageSkeleton from '../../PageSkeleton';

const AdminLayout = () => {
  const {user, loading} = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return <PageSkeleton/>;
  if (!user) return <Navigate to="/admin/login" replace/>;
  if (!user.is_staff) return <div role="alert" className="p-8">Administrator access is required.</div>;
  return (
    <div className="min-h-screen bg-[#f3f6f1] text-slate-800">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* pt-16 clears the fixed header, lg:pl-52 clears the fixed sidebar */}
      <div className="flex min-h-screen flex-col pt-16 lg:pl-52">
        <main className="flex-1 px-4 py-5 sm:px-6">
          <Suspense fallback={<PageSkeleton/>}><Outlet /></Suspense>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
