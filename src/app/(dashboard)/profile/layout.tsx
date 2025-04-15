import type { Metadata } from "next";
import ProtectedRoute from "@/components/layouts/protected";
import  Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
    title: "Profile | DK Mandiri",
    description: "Profile page for DK Mandiri User",
  };

export default function ProfileLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-6 mt-16 md:mt-0">
                {children}
              </main>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }