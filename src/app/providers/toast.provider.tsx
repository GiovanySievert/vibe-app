import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

type ToastLevel = 'success' | 'error' | 'info' | 'warning'

type ToastState = { message: string; level: ToastLevel } | null

type ToastContextType = {
  showToast: (message: string, level?: ToastLevel, durationMs?: number) => void
  toast: ToastState
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

type Props = { children: ReactNode }

export const ToastProvider = ({ children }: Props) => {
  const [toast, setToast] = useState<ToastState>(null)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const hideToast = useCallback(() => {
    setToast(null)
    if (timer) clearTimeout(timer)
    setTimer(null)
  }, [timer])

  const showToast = useCallback(
    (message: string, level: ToastLevel = 'success', durationMs = 4000) => {
      if (timer) clearTimeout(timer)
      setToast({ message, level })
      const t = setTimeout(() => hideToast(), durationMs)
      setTimer(t)
    },
    [hideToast, timer]
  )

  const value = useMemo(() => ({ showToast, toast, hideToast }), [showToast, toast, hideToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
