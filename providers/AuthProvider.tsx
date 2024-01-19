'use client'
import { FC, ReactElement, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

interface AuthProviderProps {
    children: ReactNode | ReactElement
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider