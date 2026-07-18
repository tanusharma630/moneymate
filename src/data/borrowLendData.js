/**
 * @typedef {Object} LendRecord
 * @property {string} id
 * @property {string} person
 * @property {number} amount
 * @property {string} dueDate
 * @property {"pending"|"overdue"} status
 * @property {"lent"|"borrowed"} type
 */

/** @type {LendRecord[]} */
export const borrowLendRecords = [
  { id: "bl-1", person: "Rohan Mehta", amount: 5000, dueDate: "Jul 28, 2026", status: "pending", type: "lent" },
  { id: "bl-2", person: "Priya Nair", amount: 12000, dueDate: "Aug 04, 2026", status: "overdue", type: "borrowed" },
  { id: "bl-3", person: "Karan Shah", amount: 2500, dueDate: "Jul 20, 2026", status: "pending", type: "lent" },
];
