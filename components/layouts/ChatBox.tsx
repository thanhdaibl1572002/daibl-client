'use client'
import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/components/layouts/chatbox.module.sass'
import Message from '@/components/layouts/Message'
import SendMessage from '@/components/layouts/SendMessage'
import IMessage from '@/interfaces/message'
import { ref, onValue } from 'firebase/database'
import db from '@/firebase/db'
import Logo from '../common/Logo'
import Button from '../forms/Button'
import { signOut } from 'next-auth/react'
import { IoLogOutOutline } from 'react-icons/io5'

const ChatBox: FC = ({ }) => {

  const [data, setData] = useState({})

  useEffect(() => {
    const userId = localStorage.getItem('DAIBL_userId')
    if (userId) {
      const unsubscribe = onValue(ref(db, `/data/${userId}/messages`), (snapshot) => {
        const newData = snapshot.val()
        setData(newData)
      })
      return () => unsubscribe()
    }
  }, [])

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
  }, [data])

  return (
    <div className={styles._container}>
      <div className={styles._tools}>
        <Logo 
          imageWidth={35}
          imageHeight={35}
          textSize={8}
        />
        <Button
            label=''
            icon={<IoLogOutOutline />}
            iconSize={20}
            width={35}
            height={35}
            onClick={signOut}
            theme='light'
            borderRadius={6}
        />
      </div>
      <div
        className={styles._messages}
        ref={messagesRef}
      >
        {
          data && Object.entries(data) && Object.entries(data).length > 0 && (
            Object.entries(data).map(([key, value]) => {
              const message = value as IMessage
              return (
                <Message
                  key={key}
                  id={key}
                  isResult={message.isResult}
                  isComplete={message.isComplete}
                  text={message.text}
                />
              )
            })
          )
        }
      </div>
      <SendMessage />
    </div>
  )
}

export default memo(ChatBox)