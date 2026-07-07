import { redirect } from "next/navigation";

// The monitor IS the dashboard.
export default function Page() {
    redirect("/dashboard/monitoring");
}
