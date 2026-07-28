// Icon for Tempora
function TemporaIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="14"
        cy="14"
        r="11"
        stroke="url(#tempora-gradient)"
        strokeWidth="2"
      />
      <path
        d="M14 8v6l4 3"
        stroke="url(#tempora-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="tempora-gradient" x1="3" y1="3" x2="25" y2="25">
          <stop stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-priority-low)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default TemporaIcon;
