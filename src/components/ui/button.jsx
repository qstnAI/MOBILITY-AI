cat > src/components/ui/button.jsx << 'EOF'
import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantClasses = {
    default: "bg-[#632569] text-white hover:bg-[#501e54]",
    outline: "border border-[#632569] text-[#632569] hover:bg-[#f3e9f8]",
  };
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
EOF