/**
 * This project is plain JavaScript (not TypeScript), so there's nothing to
 * export at runtime here — but keeping a `types/` entry point gives every
 * domain type a single documented home, matching the folder structure of a
 * typed codebase. Each type lives as a JSDoc @typedef next to the data it
 * describes and is re-documented here for discoverability:
 *
 * - Transaction            → @/data/transactionsData.js
 * - BudgetCategory         → @/data/budgetData.js
 * - SavingsGoal            → @/data/goalsData.js
 * - LendRecord             → @/data/borrowLendData.js
 * - Notification           → @/data/miscData.js
 * - CoachInsight           → @/data/miscData.js
 * - SummaryMetric          → @/data/summaryData.js
 * - TrendPoint             → @/data/chartData.js
 * - NavItem                → @/constants/nav.js
 * - ProfileSettingsFormValues → @/utils/schemas/profileSchema.js
 *
 * If the project migrates to TypeScript, these JSDoc typedefs translate
 * directly into `.ts` interfaces with minimal changes.
 */
export {};
