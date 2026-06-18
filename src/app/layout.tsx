import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/provider/ReduxProvider";
import { MSWProvider } from "@/components/common/MSWProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Next Starter Pack",
  description: "Production-ready Next.js SaaS starter with auth, RBAC, and admin dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster position="bottom-right" richColors />
        <ReduxProvider>
          <MSWProvider>{children}</MSWProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
