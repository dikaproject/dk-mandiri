import type { Metadata } from "next";
import ProtectedRoute from "@/components/layouts/protected";
import Sidebar from "@/components/section/admin-dashboard/Sidebar";
import Footer from "@/components/section/admin-dashboard/Footer";

export const metadata: Metadata = {
  title: "Admin Dashboard | DK Mandiri",
  description: "Admin dashboard for managing DK Mandiri's system",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-6 mt-16 md:mt-0">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}