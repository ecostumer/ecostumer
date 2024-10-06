import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon } from 'lucide-react'
import React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode
  isSubmitting: boolean
  isSubmitSuccessful?: boolean
}

export function SubmitButton({
  isSubmitting,
  isSubmitSuccessful,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-300',
        isSubmitSuccessful ? 'bg-green-500 hover:bg-green-600' : '',
        className,
      )}
      {...props}
      type="submit"
      disabled={isSubmitting || isSubmitSuccessful}
    >
      <AnimatePresence mode="wait">
        {isSubmitSuccessful ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            <CheckIcon className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isSubmitting ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </motion.div>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
