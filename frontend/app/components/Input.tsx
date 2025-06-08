import React, { ChangeEvent, useState, FocusEvent } from "react";

interface InputComponentProps {
  type: string;
  maxLength?: number;
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
}

export default function InputComponent({
  type,
  label,
  maxLength,
  placeholder,
  disabled = false,
  required = false,
  onChange,
  name,
  id,
}: InputComponentProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-black" htmlFor={id}>
        {label}
      </label>
      <input
        maxLength={maxLength}
        type={type}
        placeholder={placeholder}
        className="w-full text-black px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors duration-300"
        disabled={disabled}
        required={required}
        onChange={onChange}
        name={name}
        id={id || name}
      />
    </div>
  );
}
