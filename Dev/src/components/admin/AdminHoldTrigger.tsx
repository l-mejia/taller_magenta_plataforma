"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

const HOLD_MS = 8000;

export function AdminHoldTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { openLogin } = useAdminAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  function start() {
    triggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      openLogin();
    }, HOLD_MS);
  }

  function cancel() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleClick(e: MouseEvent) {
    if (triggeredRef.current) {
      e.preventDefault();
      triggeredRef.current = false;
      return;
    }
    router.push("/");
  }

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
