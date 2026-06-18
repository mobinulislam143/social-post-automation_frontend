import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useAppSelector } from "@/store/hooks";

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

const useDecodedToken = (): DecodedToken | null => {
  const token = useAppSelector((state) => state.auth.accessToken);

  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export default useDecodedToken;
