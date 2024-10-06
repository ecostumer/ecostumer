import './globals.css'

import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
