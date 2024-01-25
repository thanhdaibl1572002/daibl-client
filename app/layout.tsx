import { FC, ReactElement, ReactNode } from 'react'
import './globals.sass'
import type { Metadata } from 'next'
import AuthProvider from '@/providers/AuthProvider'
import MessageProvider from '@/providers/MessageProvider'


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
      <body>
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
