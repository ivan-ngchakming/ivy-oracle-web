// src/components/DisableDraftMode.tsx

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { disableDraftMode } from "../app/actions";
import Button from "./Button";

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  
  const disable = () =>
    // @ts-ignore
    startTransition(async () => {
      await disableDraftMode();
      router.refresh();
    });

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000
    }}>
      {pending ? (
        "Disabling draft mode..."
      ) : (
        <Button onClick={disable}>
          Disable draft mode
        </Button>
      )}
    </div>
  );
}