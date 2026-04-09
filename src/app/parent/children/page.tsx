import type { Metadata } from "next";
import Image from "next/image";
import { AddChildForm } from "@/components/dashboard/add-child-form";

export const metadata: Metadata = {
  title: "Add Your Child",
  robots: { index: false, follow: false },
};

export default function AddChildPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #F0FDF9 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center justify-center" aria-label="Flinchi home">
            <Image src="/flinchi.svg" alt="Flinchi" width={140} height={42} priority />
          </a>
          <h1 className="font-fredoka text-3xl font-bold text-gray-900 mt-4 mb-2">
            Add your child 👶
          </h1>
          <p className="text-gray-500">Set up their learning profile to get started</p>
        </div>
        <AddChildForm />
      </div>
    </main>
  );
}
