import React from "react";

export function Button({ children, className = "", size = "default", ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center 
        bg-[#222224] hover:bg-[#2a2a2d] text-white 
        font-medium text-sm rounded-xl px-5 py-2.5 
        border border-white/10 
        shadow-[0_4px_12px_rgba(0,0,0,0.5)] 
        transition-all duration-200 active:scale-95 
        cursor-pointer ${className}
      `}
      style={{
        backgroundColor: '#222224',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '8px 20px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        fontWeight: '500',
        fontSize: '14px'
      }}
      {...props}
    >
      {children}
    </button>
  );
}