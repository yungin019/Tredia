import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-gray-900",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-lg hover:shadow-neon [box-shadow:inset_0_0_0_0_theme(colors.white/0)] hover:[box-shadow:inset_0_0_14px_0_theme(colors.white/0.1)]",
        destructive:
          "bg-brand-loss/80 text-white hover:bg-brand-loss hover:shadow-neonSm",
        outline:
          "border border-brand-cyan/50 bg-transparent text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan",
        secondary:
          "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg hover:shadow-neon [box-shadow:inset_0_0_0_0_theme(colors.white/0)] hover:[box-shadow:inset_0_0_14px_0_theme(colors.white/0.1)]",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-brand-cyan underline-offset-4 hover:underline",
        glass:
          "glass text-white hover:bg-white/10 border-none shadow-none hover:shadow-none",
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
