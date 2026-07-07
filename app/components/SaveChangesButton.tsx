"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type SaveChangesButtonProps = {
  label?: string;
  pendingLabel?: string;
};

export default function SaveChangesButton({
  label = "Save Changes",
  pendingLabel = "Saving...",
}: SaveChangesButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black text-[14px] font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
