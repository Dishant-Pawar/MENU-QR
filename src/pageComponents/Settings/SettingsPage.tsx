// eslint-disable-next-line react-hooks/rules-of-hooks
import { useServerTranslation } from "~/i18n";
import { DashboardHeader } from "../Dashboard/molecules/Header";
import { DashboardShell } from "../Dashboard/molecules/Shell";
import { ResetPasswordSettingsForm } from "./molecules/ResetPasswordSettingsForm";
import { DeleteAccountSection } from "./molecules/DeleteAccountSection";

export const dynamic = "force-dynamic";

const SettingsPage = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useServerTranslation();

  return (
    <DashboardShell className="flex-1">
      <DashboardHeader
        heading={t("dashboardSidenav.settings")}
        text={t("settingsPage.headerDescription")}
      />
      <div className="flex flex-col gap-8 justify-center max-w-2xl mx-auto w-full">
        <ResetPasswordSettingsForm />
        <DeleteAccountSection />
      </div>
    </DashboardShell>
  );
};

export default SettingsPage;
