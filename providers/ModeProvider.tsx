'use client'
import { Dispatch, ReactElement, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

type ModeContextType = {
    mode: boolean
    setMode: Dispatch<SetStateAction<boolean>>
}

const ModeContext = createContext<ModeContextType>({
    mode: true,
    setMode: () => { },
})
const ModeProvider = ({ children }: { children: ReactNode | ReactElement }) => {
    const [mode, setMode] = useState<boolean>(true)
    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    )
}

export const useModeContext = () => useContext(ModeContext)

export default ModeProvider