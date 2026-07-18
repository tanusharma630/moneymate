import { useCallback, useState } from "react";

/**
 * Simple open/close boolean state manager for dropdowns, modals, and menus.
 * @param {boolean} [initial=false]
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
