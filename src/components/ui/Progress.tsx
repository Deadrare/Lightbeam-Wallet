import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value?: number
  className?: string
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, indicatorClassName }, ref) => (
        <div
            ref={ref}
            className={cn(
                'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
                className
            )}
        >
            <div
                className={cn('h-full w-full flex-1 bg-accent transition-all', indicatorClassName)}
                style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
            />
        </div>
    )
)
Progress.displayName = 'Progress'

export { Progress }
