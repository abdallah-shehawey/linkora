import { PublicProfile } from "@/components/public/public-profile";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PublicProfile username={decodeURIComponent(username).toLowerCase()} />;
}
