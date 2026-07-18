import { Target, Wallet } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/cards/StatCard";
import GoalsSection from "@/components/dashboard/GoalsSection";
import { savingsGoals } from "@/data/goalsData";

export default function GoalsPage() {
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Savings Goals"
        description="Track progress toward everything you're saving up for."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total saved" value={totalSaved} icon={Wallet} valueClassName="text-success" />
        <StatCard label="Combined target" value={totalTarget} icon={Target} />
      </div>

      <GoalsSection />
    </div>
  );
}
