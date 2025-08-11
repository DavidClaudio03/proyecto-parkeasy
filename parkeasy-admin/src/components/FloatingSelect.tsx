"use client"

import type React from "react"
import { useState } from "react"

interface FloatingSelectProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  label: string
  error?: string
  disabled?: boolean
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  children,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value && value.toString().trim() !== ""
  const isActive = isFocused || hasValue

  return (
    <div className={`floating-input-container ${className}`}>
      <div className="floating-input-wrapper">
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={`floating-select ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
        >
          {children}
        </select>
        <label className={`floating-label ${isActive ? "active" : ""} ${error ? "error" : ""}`}>
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
        <div className={`floating-border ${isFocused ? "focused" : ""} ${error ? "error" : ""}`}></div>
      </div>
      {error && <div className="floating-error-message">{error}</div>}
    </div>
  )
}

export default FloatingSelect
