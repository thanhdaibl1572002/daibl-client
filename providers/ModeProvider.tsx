'use client'
import { Dispatch, ReactElement, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

type ModeContextType = {
    mode: 'daibl' | 'gemini' 
    setMode: Dispatch<SetStateAction<ModeContextType['mode']>>
}

const ModeContext = createContext<ModeContextType>({
    mode: 'daibl',
    setMode: () => { },
})
const ModeProvider = ({ children }: { children: ReactNode | ReactElement }) => {
    const [mode, setMode] = useState<ModeContextType['mode']>('daibl')
    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    )
}

export const useModeContext = () => useContext(ModeContext)

export default ModeProvider