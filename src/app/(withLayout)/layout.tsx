import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { type ReactNode } from "react";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
