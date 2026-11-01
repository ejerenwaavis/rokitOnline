import { useId, type SVGProps } from "react";
import { cn } from "@/lib/utils";

type DotPatternProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  spacing?: number;
  radius?: number;
};

export function DotPattern({ className, spacing = 24, radius = 1, ...props }: DotPatternProps) {
  const id = `dots-${useId().replace(/:/g, "")}`;
  const size = Math.max(8, spacing);
  return <svg {...props} aria-hidden="true" focusable="false" className={cn("pointer-events-none absolute inset-0 h-full w-full text-neutral/25", className)}>
    <defs><pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse"><circle cx={size / 2} cy={size / 2} r={Math.max(.5, Math.min(radius, size / 4))} fill="currentColor" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>;
}