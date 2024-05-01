import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'

const BASE_STYLE =
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
const ACTIVE_STYLE = BASE_STYLE + ' bg-accent text-accent-foreground'

const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & {
        toggled: boolean
    }
>(({ className, toggled, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={
            toggled
                ? `${ACTIVE_STYLE} ${className}`
                : `${BASE_STYLE} ${className}`
        }
        {...props}
    />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
