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
import { IoLogOutOutline, IoSwapHorizontalOutline } from 'react-icons/io5'
import { useModeContext } from '@/providers/ModeProvider'
import { getColorLevel, mainColor, greenColor } from '@/components/variables'

const ChatBox: FC = () => {

  const { mode, setMode } = useModeContext()

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
    <div
      className={styles._container}
      style={{
        background: mode ? getColorLevel(mainColor, 3) : getColorLevel(greenColor, 5)
      }}
    >
      <div className={styles._tools}>
        <Logo
          imageWidth={35}
          imageHeight={35}
          logoText={mode ? 'DAIBL' : 'GPT'}
          textSize={8}
          textColor={mode ? mainColor : greenColor}
          imageSrc={`/images/common/${mode ? 'logo' : 'gpt-logo'}.png`}
        />
        <div className={styles._modes}>
          <Button
            label={mode ? 'DAIBL 1.0' : 'GPT 3.5'}
            icon={<IoSwapHorizontalOutline />}
            iconSize={18}
            width={115}
            height={35}
            textSize={15}
            textWeight={400}
            onClick={() => setMode(!mode)}
            theme={mode ? 'default' : 'success'}
            borderRadius={6}
          />
        </div>
        <Button
          label=''
          icon={<IoLogOutOutline />}
          iconSize={20}
          width={35}
          height={35}
          onClick={signOut}
          theme={mode ? 'light' : 'gpt'}
          borderRadius={6}
        />
      </div>
      <div
        className={styles._messages}
        ref={messagesRef}
      >
        {mode ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      <SendMessage />
    </div>
  )
}

export default memo(ChatBox)