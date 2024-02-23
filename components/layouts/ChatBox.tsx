'use client'
import { FC, memo, UIEvent, useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/components/layouts/chatbox.module.sass'
import Message from '@/components/layouts/Message'
import SendMessage from '@/components/layouts/SendMessage'
import IMessage from '@/interfaces/message'
import { ref, query, onValue, limitToLast } from 'firebase/database'
import db from '@/firebase/db'
import { signOut } from 'next-auth/react'
import { IoArrowDownOutline, IoLogOutOutline } from 'react-icons/io5'
import { SiGooglebard, SiNintendogamecube } from 'react-icons/si'
import { getColorLevel, mainColor, geminiColor } from '@/variables'
import Logo from '@/components/common/Logo'
import Button from '@/components/forms/Button'
import LoadMore from '@/components/common/LoadMore'
import { useMessageContext } from '@/providers/MessageProvider'
import { useSession } from 'next-auth/react'
import { useModeContext } from '@/providers/ModeProvider'

const ChatBox: FC = () => {

  const { data: session } = useSession()

  const [data, setData] = useState({})
  const [limit, setLimit] = useState<number>(10)
  const [loadMore, setLoadMore] = useState<boolean>(false)
  const [isScrollEnd, setIsScrollEnd] = useState<boolean>(true)

  const messagesRef = useRef<HTMLDivElement>(null)

  const { mode, setMode } = useModeContext()
  const { isMessageComplete, isMessageLoading } = useMessageContext()

  useEffect(() => {
    const userId = localStorage.getItem('DAIBL_userId')
    if (userId) {
      const messagesQuery = query(ref(db, `/${mode}/${userId}/messages`), limitToLast(limit))
      const unsubscribe = onValue(messagesQuery, (snapshot) => {
        const currentScrollTop = messagesRef.current!.scrollTop
        const currentScrollHeight = messagesRef.current!.scrollHeight
        const newData = snapshot.val()
        setData(newData)
        setLoadMore(false)
        requestAnimationFrame(() => {
          const newScrollTop = currentScrollTop + (messagesRef.current!.scrollHeight - currentScrollHeight)
          messagesRef.current!.scrollTop = newScrollTop
        })
      })
      return () => unsubscribe()
    }
  }, [limit, session, mode])

  useEffect(() => {
    isScrollEnd && (messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight)
  }, [data, isScrollEnd])

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
    setLimit(10)
  }, [mode])

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const isAtTop = event.currentTarget.scrollTop === 0
    const isAtBottom = event.currentTarget.scrollTop + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight - 30
    const isDataExhausted = Object.entries(data).length < limit
    isAtTop && !isDataExhausted && (setLimit(prevLimit => prevLimit + 10), setLoadMore(true))
    isAtBottom ? setIsScrollEnd(true) : setIsScrollEnd(false)
  }

  return (
    <div
      className={styles._container}
      style={{
        background: getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 3)
      }}
    >
      <div className={styles._tools}>
        <Logo
          logoText={mode.toUpperCase()}
          textSize={10.5}
          textColor={mode === 'daibl' ? mainColor : geminiColor}
          iconColor={mode === 'daibl' ? mainColor : geminiColor}
          logoIcon={mode === 'daibl' ? <SiNintendogamecube /> : <SiGooglebard />}
        />
        <Button
          label={mode === 'daibl' ? 'Chat với GEMINI' : 'Chat với DAIBL'}
          icon={useMemo(() => mode === 'daibl' ? <SiGooglebard /> : <SiNintendogamecube />, [mode])}
          iconSize={21}
          textSize={15}
          width={'fit-content'}
          height={38}
          theme={mode === 'daibl' ? 'geminiLight' : 'light'}
          borderRadius={6}
          onClick={() => setMode(prevMode => prevMode === 'daibl' ? 'gemini' : 'daibl')}
          disabled={!isMessageComplete || isMessageLoading}
        />
        <Button
          label=''
          icon={useMemo(() => <IoLogOutOutline />, [])}
          iconSize={22}
          width={38}
          height={38}
          onClick={signOut}
          theme={mode === 'daibl' ? 'light' : 'geminiLight'}
          borderRadius={6}
        />
      </div>
      <div
        className={styles._messages}
        ref={messagesRef}
        onScroll={handleScroll}
      >
        {loadMore && <LoadMore color={mode === 'daibl' ? mainColor : geminiColor} />}
        {
          data && Object.keys(data) && Object.keys(data).length > 0 && (
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
        {isMessageLoading && (
          <Message
            id={Date.now().toString()}
            isResult={true}
            isComplete={true}
            text={'**Đang tạo câu trả lời, vui lòng đợi...**'}
          />
        )}
      </div>
      {!isScrollEnd && !isMessageComplete && (
        <div
          className={styles._generating}
          style={{
            color: mode === 'daibl' ? mainColor : geminiColor,
            border: `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 30)}
            `
          }}
        >
          Đang trả lời
          <span className={styles[`_${mode}__generating`]}></span>
        </div>
      )}
      {!isScrollEnd && (
        <div className={styles._scroll__end}>
          <Button
            label=''
            icon={<IoArrowDownOutline />}
            iconSize={18}
            width={35}
            height={35}
            theme={mode === 'daibl' ? 'light' : 'geminiLight'}
            borderRadius={'50%'}
            onClick={() => messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight}
          />
        </div>
      )}
      <SendMessage />
    </div>
  )
}

export default memo(ChatBox)

