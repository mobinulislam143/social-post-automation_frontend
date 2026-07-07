export const env = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://omirasocialtrack-backend.vercel.app/api/v1",
} as const;
