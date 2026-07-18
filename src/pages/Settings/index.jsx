import PageHeader from "@/components/common/PageHeader";
import ProfileSettingsForm from "@/components/forms/ProfileSettingsForm";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" description="Manage your profile and app preferences." />
      <ProfileSettingsForm />
    </div>
  );
}
