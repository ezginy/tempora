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
      <defs>
        <linearGradient
          id="tempora-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
        >
          <stop stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-priority-low)" />
        </linearGradient>

        {/* white = visible, black = hidden — cuts the clock where the board box sits */}
        <mask id="clock-mask">
          <rect x="0" y="0" width="28" height="28" fill="white" />
          <rect x="0" y="14" width="13" height="13" fill="black" />
        </mask>
      </defs>

      <g mask="url(#clock-mask)">
        <circle
          cx="15"
          cy="12"
          r="9"
          stroke="url(#tempora-gradient)"
          strokeWidth="2"
        />
        <path
          d="M15 7v5l4 2"
          stroke="url(#tempora-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <rect
        x="1"
        y="15"
        width="11"
        height="11"
        rx="3"
        fill="none"
        stroke="url(#tempora-gradient)"
        strokeWidth="1.6"
      />
      <line
        x1="3.5"
        y1="18.5"
        x2="9.5"
        y2="18.5"
        stroke="url(#tempora-gradient)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="3.5"
        y1="22"
        x2="8"
        y2="22"
        stroke="url(#tempora-gradient)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default TemporaIcon;
