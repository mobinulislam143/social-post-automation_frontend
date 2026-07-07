import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/provider/ReduxProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "OMIRA Social Monitor",
  description: "Internal dashboard monitoring daily social posting across client businesses.",
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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
