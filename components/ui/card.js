import React from 'react';

export function Card({ children, className }) {
  return (
    <div className={`bg-white/10 text-white p-4 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="border-b border-white/20 pb-2 mb-3">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
