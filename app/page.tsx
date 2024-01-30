'use client'
import { FC, useEffect, useState } from 'react'
import styles from './page.module.sass'
import ChatBox from '@/components/layouts/ChatBox'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import db from '@/firebase/db'
import { ref, get, set } from 'firebase/database'
import { datasetLink } from '@/app/variables'

const Home: FC = ({ }) => {
  const { data: session } = useSession({ required: true })
  const [authId, setAuthId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    router.reload()
  }, [session, authId, router])

  useEffect(() => {
    if (session && session.user.id !== authId) {
      setAuthId(session.user.id)
      localStorage.setItem('DAIBL_userId', session.user.id)
      const messageId = Date.now().toString()
      const dataRef = ref(db, `data/${session.user.id}`)

      get(dataRef).then((snapshot) => {
        if (!snapshot.exists()) {
          set(ref(db, `data/${session.user.id}/messages/${messageId}`), {
            isComplete: false,
            isResult: true,
            text: `
              Xin chào <b>${session.user.name}</b>! Tôi tên <strong>DAIBL</strong>,
              một mô hình máy học được huấn luyện với mục đích dự đoán cảm xúc có trong
              bình luận, phản hồi của khách hàng về sản phẩm mà họ đã trải nghiệm
              khi mua hàng từ các cửa hàng thời trang. Kết quả của dự đoán có thể 
              bao gồm một trong các cảm xúc <b>tích cực</b>, <b>tiêu cực</b> hoặc <b>trung lập</b>.
              <br/> 
              Ví dụ, bạn có thể bình luận về các sản phẩm thời trang mà bạn đã mua
              được, sau đó mô hình sẽ giúp dự đoán cảm xúc có trong bình luận
              của bạn: 
              <br/>
              - <b>Chất liệu vải khá tốt 👍</b> 
              <br/>
              - <b>Giao hàng chậm, áo quá rộng 👎</b>
              <br/>
              - <b>Sản phẩm tạm ổn, chưa gọi là đẹp lắm 🤷</b>
              <br/>
              Tôi được huấn luyện bằng phương pháp Support Vector Machines (SVM)
              với bộ dữ liệu
              <a href="${datasetLink}"target="_blank">Vietnamese Sentiment Analyst (Kaggle)</a>.
              `
          })
        }
      })
    }
  }, [session, authId])


  return (
    <main className={styles._container}>
      {session && <ChatBox />}
    </main>
  )
}

export default Home
