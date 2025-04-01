"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import Transactions from "@/components/Transactions";
import Statement from "@/components/Statement";
import Settings from "@/components/Settings";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

function DashboardContent() {
  const { activeComponent } = useDashboard();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="p-6 pt-2.5 min-h-screen">
          {/* Header */}
          <Header />

          {/* Wallet Card */}
          {activeComponent === "dashboard" && (
            <div className="mt-6">
              <WalletCard />
            </div>
          )}

          {/* Transactions/Statement/Settings */}
          <div className="mt-6">
            {activeComponent === "dashboard" ? (
              <Transactions />
            ) : activeComponent === "statement" ? (
              <Statement />
            ) : (
              <Settings />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
