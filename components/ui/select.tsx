import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange }: any) => {
  return React.cloneElement(children[0], { value, onValueChange, children: children.slice(1) })
}

const SelectTrigger = ({ children, value, onValueChange, className }: any) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </select>
  )
}

const SelectValue = ({ placeholder }: any) => null

const SelectContent = ({ children }: any) => <>{children}</>

const SelectItem = ({ value, children }: any) => {
  return <option value={value}>{children}</option>
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
