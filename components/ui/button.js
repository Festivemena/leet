import React from "react";

export function Button({ children, onClick, variant = "default", className = "" }) {
  const baseStyles = "px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold";

  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-white/50 text-white hover:bg-white/20",
    ghost: "text-white hover:bg-white/10",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
