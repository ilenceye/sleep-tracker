import { cn } from "@/lib/classnames";

export function Container({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children: React.ReactNode }) {
  return (
    <div className={cn("bg-secondary h-screen p-4", className)}>{children}</div>
  );
}
