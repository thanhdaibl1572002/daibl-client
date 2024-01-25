'use client'
import { FC, memo, UIEvent, useEffect, useMemo, useRef, useState, WheelEvent } from 'react'
import styles from '@/components/layouts/chatbox.module.sass'
import Message from '@/components/layouts/Message'
import SendMessage from '@/components/layouts/SendMessage'
import IMessage from '@/interfaces/message'
import { ref, query, onValue, limitToLast } from 'firebase/database'
import db from '@/firebase/db'
import Logo from '../common/Logo'
import Button from '../forms/Button'
import { signOut } from 'next-auth/react'
import { IoArrowDownOutline, IoLogOutOutline } from 'react-icons/io5'
import { SiGooglecolab } from 'react-icons/si'
import { getColorLevel, mainColor, modelLink } from '@/components/variables'
import LoadMore from '../common/LoadMore'
import { useMessageContext } from '@/providers/MessageProvider'

const ChatBox: FC = () => {

  const [dataDAIBL, setDataDAIBL] = useState({})
  const [limit, setLimit] = useState(10)
  const [loadMore, setLoadMore] = useState(false)
  const [isScrollEnd, setIsScrollEnd] = useState(false)

  const messagesRef = useRef<HTMLDivElement>(null)

  // const { isMessageComplete } = useMessageContext()

  useEffect(() => {
    const userId = localStorage.getItem('DAIBL_userId')
    if (userId) {
      const messagesQuery = query(ref(db, `/data/${userId}/messages`), limitToLast(limit))
      const unsubscribe = onValue(messagesQuery, (snapshot) => {
        const currentScrollTop = messagesRef.current!.scrollTop
        const currentScrollHeight = messagesRef.current!.scrollHeight
        const newData = snapshot.val()
        setDataDAIBL(newData)
        setLoadMore(false)
        requestAnimationFrame(() => {
          const newScrollTop = currentScrollTop + (messagesRef.current!.scrollHeight - currentScrollHeight)
          messagesRef.current!.scrollTop = newScrollTop
        })
      })
      return () => unsubscribe()
    }
  }, [limit])

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
  }, [dataDAIBL])

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const isAtTop = event.currentTarget.scrollTop === 0
    const isAtBottom = event.currentTarget.scrollTop + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight - 25
    const isDataExhausted = Object.entries(dataDAIBL).length < limit
    isAtTop && !isDataExhausted && (setLimit(prevLimit => prevLimit + 10), setLoadMore(true))
    // isAtBottom ? setIsScrollEnd(false) : setIsScrollEnd(true)
  }

  return (
    <div
      className={styles._container}
      style={{
        background: getColorLevel(mainColor, 3)
      }}
    >
      <div className={styles._tools}>
        <Logo
          imageWidth={40}
          imageHeight={40}
          logoText={'DAIBL'}
          textSize={10.5}
          textColor={mainColor}
          imageSrc={`/images/common/logo.png`}
        />
        <Button
          label='Source Code'
          icon={useMemo(() => <SiGooglecolab />, [])}
          iconSize={24}
          textSize={15}
          width={'fit-content'}
          height={38}
          onClick={signOut}
          theme={'light'}
          borderRadius={6}
          link={modelLink}
        />
        <Button
          label=''
          icon={useMemo(() => <IoLogOutOutline />, [])}
          iconSize={22}
          width={38}
          height={38}
          onClick={signOut}
          theme={'light'}
          borderRadius={6}
        />
      </div>
      <div
        className={styles._messages}
        ref={messagesRef}
        onScroll={handleScroll}
      >
        {loadMore && <LoadMore />}
        {
          dataDAIBL && Object.keys(dataDAIBL) && Object.keys(dataDAIBL).length > 0 && (
            Object.entries(dataDAIBL).map(([key, value]) => {
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
      {/* {isScrollEnd && !isMessageComplete && (
        <div className={styles._generating}>
          Đang trả lời
          <span></span>
        </div>
      )} */}
      {isScrollEnd && (
        <div className={styles._scroll__end}>
          <Button
            label=''
            icon={<IoArrowDownOutline />}
            iconSize={18}
            width={35}
            height={35}
            theme={'light'}
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