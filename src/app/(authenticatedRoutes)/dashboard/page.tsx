import { DashboardPage } from "~/pageComponents/Dashboard/Dashboard.page";

// Force dynamic rendering - this route requires authentication
export const dynamic = "force-dynamic";

export default async function DashboardPageTest() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
