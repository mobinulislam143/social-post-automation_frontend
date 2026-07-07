import { redirect } from "next/navigation";

// Single-purpose app: land straight on the login page.
export default function Home() {
    redirect("/login");
}
