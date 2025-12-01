import Header from "@/components/layout/dashboard/Header";
import NavbarDashboard from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F5F6F8] text-gray-900">
        <NavbarDashboard />

        <div className="flex pt-16">
          <aside
            className={`
              hidden lg:block w-80 shrink-0 
              sticky top-16 
              h-[calc(100vh-4rem)] 
              overflow-y-auto
              border-r border-gray-200 
              bg-white 
              shadow-sm
              transition-all duration-300
            `}
          >
            <Sidebar />
          </aside>

          <main
            className={`
              flex-1 w-full p-4 md:p-8 
              overflow-hidden
            `}
          >
            <div
              className="
                mx-auto max-w-7xl
                animate-in fade-in slide-in-from-bottom-4 
                duration-500
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
