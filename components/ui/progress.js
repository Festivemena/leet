import React from "react";

export function Progress({ value, className = "" }) {
  return (
    <div className={`w-full h-2 bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-green-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
