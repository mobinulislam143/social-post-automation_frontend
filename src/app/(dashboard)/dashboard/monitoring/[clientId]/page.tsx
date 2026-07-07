import ClientHistory from "@/components/dashboard/monitoring/ClientHistory";

export default async function Page({
    params,
}: {
    params: Promise<{ clientId: string }>;
}) {
    const { clientId } = await params;
    return (
        <div>
            <ClientHistory clientId={clientId} />
        </div>
    );
}
