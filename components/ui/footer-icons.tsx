const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-4 shrink-0",
  "aria-hidden": true as const,
};

export const instagramIcon = (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const phoneIcon = (
  <svg {...iconProps}>
    <path d="m7 3 3 5-3 2a14 14 0 0 0 7 7l2-3 5 3v3a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1Z" />
  </svg>
);

export const locationIcon = (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
