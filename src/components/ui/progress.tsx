import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";
const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  variant?: 'default' | 'teal' | 'purple';
}>(({
  className,
  value,
  variant = 'default',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-brand-blue',
    teal: 'bg-brand-teal',
    purple: 'bg-brand-purple'
  };
  return <ProgressPrimitive.Root ref={ref} className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-200", className)} {...props}>
      <ProgressPrimitive.Indicator className={cn("h-full w-full flex-1 transition-all", variantClasses[variant])} style={{
      transform: `translateX(-${100 - (value || 0)}%)`
    }} />
    </ProgressPrimitive.Root>;
});
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };