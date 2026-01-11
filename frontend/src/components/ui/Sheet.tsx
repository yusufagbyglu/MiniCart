"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"

interface SheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [open])

    if (!open) return null

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
                {children}
            </div>
        </>
    )
}

const SheetContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "pointer-events-auto fixed right-0 top-0 z-50 h-full w-full bg-background shadow-xl transition-transform duration-300 sm:max-w-md",
            "border-l flex flex-col",
            className
        )}
        {...props}
    >
        {children}
        {onClose && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>
        )}
    </div>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-left px-6 py-6 border-b",
            className
        )}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-xl font-semibold text-foreground pr-8", className)}
        {...props}
    />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetDescription.displayName = "SheetDescription"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t mt-auto",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

export {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
