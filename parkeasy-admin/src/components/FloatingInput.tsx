"use client"

import type React from "react"
import { useState } from "react"

interface FloatingInputProps {
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
  error?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
  step?: string
  className?: string
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  min,
  max,
  step,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value && value.toString().trim() !== ""
  const isActive = isFocused || hasValue

  return (
    <div className={`floating-input-container ${className}`}>
      <div className="floating-input-wrapper">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`floating-input ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
          placeholder=""
        />
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

export default FloatingInput
