import { PrefetchTRPCQuery } from "~/components/PrefetchTRPCQuery/PrefetchTRPCQuery";
import { LayoutView } from "./_components/LayoutView";

// Force dynamic rendering for all authenticated routes
export const dynamic = "force-dynamic";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrefetchTRPCQuery queryName="auth.getProfile">
      <LayoutView>{children}</LayoutView>
    </PrefetchTRPCQuery>
  );
}

export default RootLayout;
