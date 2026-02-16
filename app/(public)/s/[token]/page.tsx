import { notFound } from "next/navigation";
import { getPublicSchedulingPage } from "@/features/scheduling/queries/getPublicSchedulingPage";
import { PublicSchedulingPage } from "@/features/scheduling/components/PublicSchedulingPage";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const data = await getPublicSchedulingPage(token);
  return { title: data ? `Book - ${data.companyName}` : "Book Online" };
}

export default async function PublicSchedulingPageRoute({ params }: Props) {
  const { token } = await params;
  if (!token) notFound();

  const data = await getPublicSchedulingPage(token);
  if (!data) notFound();

  return <PublicSchedulingPage data={data} token={token} />;
}
