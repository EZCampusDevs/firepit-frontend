import React from 'react'

import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

//type ErrorProps = React.ComponentProps<typeof Card>

interface ErrorProps {
    error_msg: string
}

export function ErrorAlert(props: ErrorProps) {
    const { error_msg } = props

    return (
        <>
            {error_msg ? (
                <Alert
                    variant="destructive"
                    className="m-8 w-50 dark:text-red-500 text-red-700"
                >
                    <AlertTriangle className="h-8 w-8 mr-12" />
                    <div className="ml-6">
                        <AlertTitle className="font-bold mb-2">
                            Error:
                        </AlertTitle>
                        <AlertDescription>{error_msg}</AlertDescription>
                    </div>
                </Alert>
            ) : (
                ''
            )}
        </>
    )
}
