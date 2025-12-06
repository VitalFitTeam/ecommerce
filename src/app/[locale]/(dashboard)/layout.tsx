import NavbarDashboard from "@/components/features/dashboard/Navbar";
import Sidebar from "@/components/features/dashboard/Sidebar";
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
          <Sidebar />
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
