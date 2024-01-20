'use client'
import { Dispatch, ReactElement, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

type MessageContextType = {
    isMessageComplete: boolean
    setIsMessageComplete: Dispatch<SetStateAction<boolean>>
}

const MessageContext = createContext<MessageContextType>({
    isMessageComplete: true,
    setIsMessageComplete: () => { },
})
const MessageProvider = ({ children }: { children: ReactNode | ReactElement }) => {
    const [isMessageComplete, setIsMessageComplete] = useState(true)
    return (
        <MessageContext.Provider value={{ isMessageComplete, setIsMessageComplete }}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext)

export default MessageProvider