import AuthWrapper from "@/components/auth/AuthWrapper";
import ResetPasswordModal from "@/components/auth/ResetPasswordModal";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <AuthWrapper>
      <ResetPasswordModalWrapper searchParams={searchParams} />
    </AuthWrapper>
  );
}

async function ResetPasswordModalWrapper({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  return <ResetPasswordModal token={token} />;
}
