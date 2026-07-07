import AuthWrapper from "@/components/auth/AuthWrapper";
import Register from "@/components/auth/Register";

export default function Page() {
    return (
        <div>
            <AuthWrapper>
                <Register />
            </AuthWrapper>
        </div>
    );
}
