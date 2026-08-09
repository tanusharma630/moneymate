/**
 * The MoneyMate brand mark: an ascending line inside a gradient rounded
 * square. Used in the sidebar header and as the basis for public/favicon.svg.
 * @param {Object} props
 * @param {number} [props.size=28]
 */
export default function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="mm-logo-grad" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0%" stopColor="#6E7BF2" />
          <stop offset="100%" stopColor="#3ED9A4" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="8" fill="url(#mm-logo-grad)" />
      <path
        d="M6.5 17.5 L11 12 L14.5 15 L21.5 7.5"
        stroke="#0B1020"
        strokeWidth="2.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.5" cy="7.5" r="1.9" fill="#0B1020" />
    </svg>
  );
}
