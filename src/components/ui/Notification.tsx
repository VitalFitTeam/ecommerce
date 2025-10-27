import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { XCircleIcon, BellIcon } from "@heroicons/react/24/solid";

const notificationVariants = cva(
  "fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md rounded-lg border p-4 text-center shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-gray-200 bg-white text-black",
        success: "border-gray-200 bg-white text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description: string;
  onClose?: () => void;
}
const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant, title, description, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(notificationVariants({ variant }), className)}
        {...props}
      >
        {variant === "success" && <BellIcon className="mr-2 h-6 w-6" />}
        {variant === "destructive"}
        {title && (
          <h5 className="mb-1 font-bebas text-xl font-semibold tracking-tight">
            {title}
          </h5>
        )}
        <p className="text-sm">{description}</p>
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2">
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  },
);
Notification.displayName = "Notification";

export { Notification };
