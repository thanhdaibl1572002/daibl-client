'use client'
import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/components/layouts/chatbox.module.sass'
import Message from '@/components/layouts/Message'
import SendMessage from '@/components/layouts/SendMessage'
import IMessage from '@/interfaces/message'
import { ref, onValue, equalTo, query, get, orderByChild } from 'firebase/database'
import db from '@/firebase/db'

const ChatBox: FC = ({ }) => {

  const [data, setData] = useState({})

  const userId = localStorage.getItem('DAIBL_userId')

  useEffect(() => {
    const unsubscribe = onValue(ref(db, `/data/${userId}/messages`), (snapshot) => {
      const newData = snapshot.val()
      setData(newData)
    })
    return () => unsubscribe()
  }, [userId])

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
  }, [])

  return (
    <div className={styles._container}>
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

// const textDesign2: string = `
// Cơ sở vật chất của trường học không đảm bảo chất lượng.
// `

// const textDesign3: string = `
// Bình luận "Cơ sở vật chất của trường học không đảm bảo chất lượng." có vẻ mang cảm xúc tiêu cực.
// `

// const textDesign4: string = `The school facilities are not up to par.`

// const textDesign5: string = `Có vẻ bình luận mà bạn nhập vào không phải là tiếng Việt,
// tôi không thể giúp bạn dự đoán cảm xúc của bình luận này.`

// const textDesign6: string = `
// Chào mừng bạn! Tôi tên DAIBL, tôi là một mô hình máy học được phát triển bởi
// 😍 Trương Thành Đại - 3120410105 😍, có thể phân loại bình luận dựa trên cảm xúc
// dành riêng cho ngôn ngữ tiếng Việt. Tôi được huấn luyện bằng phương pháp phân loại
// văn bản Naive Bayes. Tôi chỉ có thể giúp bạn dự đoán cảm xúc tích cực, trung lập
// và tiêu cực của bình luận được nhập vào.
// `