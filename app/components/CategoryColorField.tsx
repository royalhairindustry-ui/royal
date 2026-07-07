"use client";

import { useState } from "react";

type CategoryColorFieldProps = {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  helpText?: string;
  placeholder?: string;
};

export default function CategoryColorField({
  name,
  id,
  label,
  defaultValue = "",
  helpText = "Use a hex color like #4f43a5",
  placeholder = "#4f43a5",
}: CategoryColorFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const colorValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ? value
    : "#000000";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-medium text-zinc-700"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={colorValue}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-14 rounded-xl border border-zinc-200 bg-white p-1"
          aria-label={label}
        />
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
        />
      </div>
      <p className="mt-1 text-[11px] text-zinc-400">{helpText}</p>
    </div>
  );
}
