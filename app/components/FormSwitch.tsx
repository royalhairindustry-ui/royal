"use client";

import * as React from "react";
import { Switch } from "@/components/ui/interfaces-switch";

type FormSwitchProps = {
  name: string;
  id?: string;
  defaultChecked?: boolean;
  className?: string;
  disabled?: boolean;
};

/**
 * Form-friendly wrapper around the Radix Switch.
 * Submits as `name=on` when checked (mirroring native checkbox semantics) so it
 * drops into existing server-action form handlers without changes.
 */
export default function FormSwitch({
  name,
  id,
  defaultChecked = false,
  className,
  disabled,
}: FormSwitchProps) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={disabled}
        className={className}
      />
      {checked && <input type="hidden" name={name} value="on" />}
    </>
  );
}
