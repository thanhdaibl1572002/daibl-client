/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, UIEvent, useEffect, useState } from 'react'
import styles from '@/components/layouts/chatbox.module.sass'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setMessages } from '@/redux/slices/generateMessage'
import { convertMessagesToHistories, getLimitedMessages, writeTestMessages } from '@/firebase/query'
import GenerateMessage from '@/components/common/GenerateMessage'
import UserMessage from '@/components/common/UserMessage'
import AIMessage from '@/components/common/AIMessage'

interface IMessage {
  key: string;
  role: string;
  message: string;
}

interface IChatBoxProps {
  mode: 'daibl' | 'gemini',
  userID: string
}

const ChatBox: FC<IChatBoxProps> = ({
  mode,
  userID,
}) => {

  const { messages } = useAppSelector(state => state.generateMessage)
  const dispatch = useAppDispatch()
  // const [isLoadMore, setIsLoadMore] = useState(false)

  useEffect(() => {
    (async () => {
      const loadedMessages = await getLimitedMessages(mode, userID, 10)
      dispatch(setMessages(loadedMessages))
    })()
  }, [mode, userID])
  

  // const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
  //   const target = event.currentTarget
  //   if (target.scrollTop === 0 && !isLoadMore) {
  //     setIsLoadMore(true);
  //     (async () => {
  //       const additionalMessages = await getLimitedMessages(mode, userID, messages.length + 10)
  //       dispatch(setMessages([...messages, ...additionalMessages]))
  //       setIsLoadMore(false)
  //     })()
  //   }
  // }


  return (
    <div className={styles[`_container__${mode}`]}> {/* onScroll={handleScroll} */}
      {messages && messages.length > 0 && messages.map((mes, mesIndex) => {
        switch (mes.role) {
          case 'ai':
            if (mes.message) {
              return <AIMessage key={mesIndex} mode={mode} text={mes.message} />
            } else {
              return <GenerateMessage key={mesIndex} mode={mode} />
            }
          case 'user':
            return <UserMessage key={mesIndex} mode={mode} text={mes.message} />
          default:
            return null
        }
      })}
    </div>
  )
}

export default ChatBox