'use client'
import { Dispatch, ReactElement, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

type MessageContextType = {
    isMessageComplete: boolean
    isMessageLoading: boolean
    setIsMessageComplete: Dispatch<SetStateAction<boolean>>
    setIsMessageLoading: Dispatch<SetStateAction<boolean>>
}

const MessageContext = createContext<MessageContextType>({
    isMessageComplete: true,
    isMessageLoading: false,
    setIsMessageComplete: () => { },
    setIsMessageLoading: () => { },
})
const MessageProvider = ({ children }: { children: ReactNode | ReactElement }) => {
    const [isMessageComplete, setIsMessageComplete] = useState<boolean>(true)
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false)
    return (
        <MessageContext.Provider 
            value={{ 
                isMessageComplete, 
                setIsMessageComplete, 
                isMessageLoading, 
                setIsMessageLoading 
            }}
        >
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext)

export default MessageProvider