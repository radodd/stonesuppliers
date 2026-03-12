const IncrementIcon = ({ color, size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Add">
        <rect x="5" width="2" height="12" rx="1" fill={color} />
        <rect
          x="12"
          y="5"
          width="2"
          height="12"
          rx="1"
          transform="rotate(90 12 5)"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default IncrementIcon;
