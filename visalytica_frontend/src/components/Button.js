export default function Button({ 
  children, 
  classes = "", 
  onClick, 
  type = "button",
  disabled = false,
  ...props 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        hover:scale-[1.01] active:scale-95
         hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        font-medium
        text-xs xs:text-sm sm:text-base
        rounded-md xs:rounded-lg sm:rounded-xl
        ${classes}
      `}
      {...props}
    >
      {children}
    </button>
  );
}