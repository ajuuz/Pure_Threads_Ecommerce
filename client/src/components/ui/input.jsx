import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type,id,name, ...props }, ref) => {
  return (
    (<input
      type={type}
      id={id}
      name={name}
      className={cn(
        "h-9 rounded-md border  px-3 py-1  shadow-sm transition-colors  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
