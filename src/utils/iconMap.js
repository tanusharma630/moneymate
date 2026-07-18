import {
  UtensilsCrossed,
  Plane,
  Receipt,
  ShoppingBag,
  Clapperboard,
  Wallet,
  Laptop,
} from "lucide-react";

/**
 * Central registry mapping icon name strings (as stored in mock/data files)
 * to their lucide-react component. Keeps data files framework-agnostic and
 * avoids importing React components directly inside data/*.js.
 */
export const ICON_MAP = {
  UtensilsCrossed,
  Plane,
  Receipt,
  ShoppingBag,
  Clapperboard,
  Wallet,
  Laptop,
};

/**
 * @param {string} name - key into ICON_MAP
 * @returns {import('lucide-react').LucideIcon}
 */
export function resolveIcon(name) {
  return ICON_MAP[name] ?? Receipt;
}
