import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-lg hover:shadow-neonSm",
        destructive: "bg-brand-loss text-white hover:bg-brand-loss/90",
        outline:
          "border border-brand-cyan bg-transparent text-brand-cyan hover:bg-brand-cyan hover:text-white",
        secondary:
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-neonSm",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-brand-cyan underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
