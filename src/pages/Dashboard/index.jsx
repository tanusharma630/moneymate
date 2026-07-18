import { motion } from "framer-motion";
import { SkeletonDashboard } from "@/components/ui/Skeleton";
import SummaryCardsSection from "@/components/dashboard/SummaryCardsSection";
import AnalyticsChart from "@/components/charts/AnalyticsChart";
import CoachCard from "@/components/cards/CoachCard";
import BudgetSection from "@/components/dashboard/BudgetSection";
import GoalsSection from "@/components/dashboard/GoalsSection";
import BorrowLendSection from "@/components/dashboard/BorrowLendSection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import { useAppContext } from "@/context/AppContext";
import { useInitialLoad } from "@/hooks/useInitialLoad";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export default function DashboardPage() {
  useInitialLoad();
  const { isInitialLoading } = useAppContext();

  if (isInitialLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <motion.div className="flex flex-col gap-4" {...fadeIn}>
      <SummaryCardsSection />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <AnalyticsChart />
        <CoachCard />
      </div>

      <BudgetSection />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GoalsSection />
        <BorrowLendSection />
      </div>

      <TransactionsSection />
    </motion.div>
  );
}
