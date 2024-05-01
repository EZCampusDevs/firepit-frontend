import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDarkMode = theme === 'dark'

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark')
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
