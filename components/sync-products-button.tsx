"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { syncProductsAction } from "@/app/actions/sync";

export function SyncProductsButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded bg-leaf px-4 py-2 font-semibold text-white disabled:opacity-60"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const summary = await syncProductsAction();
            setMessage(
              summary.errors.length
                ? `Sync completed with ${summary.errors.length} error(s): ${summary.errors.join(", ")}`
                : `Fetched ${summary.fetched}; inserted/updated ${summary.upserted}.`
            );
          })
        }
      >
        <RefreshCw size={18} aria-hidden />
        {isPending ? "Syncing..." : "Sync Fake Store"}
      </button>
      {message ? <p className="text-sm text-ink/65">{message}</p> : null}
    </div>
  );
}
