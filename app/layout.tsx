import { FC, ReactElement, ReactNode } from 'react'
import './globals.sass'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/providers/AuthProvider'
import MessageProvider from '@/providers/MessageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DAIBL',
  description: 'DAIBL - Chat Application',
}

interface RootLayoutProps {
  children: ReactNode | ReactElement
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MessageProvider>
            {children}
          </MessageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
