const Button = ({
  type,
  bgColor,
  color,
  size = "sm",
  children,
  borderRadius,
  onClick,
  disabled,
  fullWidth = false, // Tambahan default value
}) => {
  return (
    <button
      type={type}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`text-${size} pt-2 pb-2 pl-4 pr-4 hover:opacity-90 justify-center ${
        fullWidth ? "w-full" : "w-fit"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
