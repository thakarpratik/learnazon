import type { Metadata } from "next";
import { ChildDashboard } from "@/components/dashboard/child-dashboard";

export const metadata: Metadata = {
  title: "My Learning World",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <ChildDashboard />;
}
