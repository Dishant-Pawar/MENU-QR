import { MenuCreatorPage } from "~/pageComponents/MenuCreator/MenuCreator.page";

// Force dynamic rendering - this route requires authentication
export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  return <MenuCreatorPage params={params} />;
}
