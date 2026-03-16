import type { Metadata } from "next";
import { ParentDashboard } from "@/components/parent/parent-dashboard";

export const metadata: Metadata = {
  title: "Parent Dashboard",
  robots: { index: false, follow: false },
};

export default function ParentPage() {
  return <ParentDashboard />;
}
