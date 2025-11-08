"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerActionButtonProps extends ButtonProps {
  pendingText?: string;
}

export function ServerActionButton({
  children,
  pendingText = "Loading...",
  disabled,
  className,
  ...props
}: ServerActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(className)}
      {...props}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  );
}

