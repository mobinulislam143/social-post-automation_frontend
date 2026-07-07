import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { SocialPlatform } from "@/types/monitoring.type";

const ICONS: Record<SocialPlatform, { Icon: typeof FaInstagram; className: string }> = {
  INSTAGRAM: { Icon: FaInstagram, className: "text-pink-600" },
  YOUTUBE: { Icon: FaYoutube, className: "text-red-600" },
  TIKTOK: { Icon: FaTiktok, className: "text-gray-900" },
  FACEBOOK: { Icon: FaFacebook, className: "text-blue-600" },
  LINKEDIN: { Icon: FaLinkedin, className: "text-sky-700" },
  X: { Icon: FaXTwitter, className: "text-gray-900" },
};

export default function PlatformIcon({
  platform,
  className = "w-4 h-4",
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const entry = ICONS[platform];
  if (!entry) return null;
  const { Icon, className: color } = entry;
  return <Icon className={`${className} ${color}`} title={platform} />;
}
