'use client'
import { FC, memo, useState } from 'react'
import styles from '@/components/layouts/sendmessage.module.sass'
import TextArea from '@/components/forms/TextArea'
import Button from '@/components/forms/Button'
import { IoSendOutline } from 'react-icons/io5'
import IMessage from '@/interfaces/message'
import { ref, set } from 'firebase/database'
import db from '@/firebase/db'
import axios from 'axios'
import { useMessageContext } from '@/providers/MessageProvider'
import { getColorLevel, greenColor, mainColor } from '@/components/variables'

const SendMessage: FC = () => {

    const [text, setText] = useState<string>('')

    const { isMessageComplete, setIsMessageComplete } = useMessageContext()

    const handleSendMessage = async () => {
        if (text.trim()) {
            const id = Date.now().toString()
            const newMessage: IMessage = {
                id: id,
                text: text,
                isComplete: true,
                isResult: false,
            }
            const userId = localStorage.getItem('DAIBL_userId')
            if (userId) {
                setText('')
                set(ref(db, `/data/${userId}/messages/${id}`), newMessage)
                setIsMessageComplete(false)
                try {
                    const response = await axios.post('https://flask-test-9896.onrender.com/predict', { message: newMessage.text })
                    if (response.data) {
                        const resultMessage: IMessage = {
                            id: Date.now().toString(),
                            text: '',
                            isComplete: false,
                            isResult: true,
                        }
                        if (response.data === -2) {
                            resultMessage.text = `
                            Bình luận "${newMessage.text}" của bạn có vẻ không phải là tiếng Việt. Điều này có thể ảnh hưởng đến độ chính
                            xác của dự đoán, vui lòng nhập lại bình luận khác bằng tiếng Việt. 
                            `
                        } else if (response.data === -1) {
                            resultMessage.text = `Bình luận "${newMessage.text}" của bạn có vẻ mang cảm xúc tiêu cực.`
                        } else if (response.data === 0) {
                            resultMessage.text = `Bình luận "${newMessage.text}" của bạn có vẻ mang cảm xúc trung lập.`
                        } else if (response.data === 1) {
                            resultMessage.text = `Bình luận "${newMessage.text}" của bạn có vẻ mang cảm xúc tích cực.`
                        }
                        set(ref(db, `/data/${userId}/messages/${resultMessage.id}`), resultMessage)
                    }
                    setIsMessageComplete(true)
                } catch (error) {
                    console.error('Error sending POST request:', error)
                }
            }
        }
    }

    return (
        <div className={styles._container}>
            <div className={styles._form}>
                <TextArea
                    width={'100%'}
                    height={50}
                    inputWidth={'100%'}
                    inputHeight={50}
                    padding='10px 55px 10px 12px'
                    border={`1px solid ${getColorLevel(mainColor, 20)}`}
                    placeholder={'Viết bình luận tại đây'}
                    value={text}
                    onChange={event => setText(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === 'Enter' && isMessageComplete && text.trim()) {
                            event.preventDefault()
                            handleSendMessage()
                        }
                    }}
                    onFocus={event => {
                        event.currentTarget.style.border = `1px solid ${getColorLevel(mainColor, 80)}`
                    }}
                    onBlur={event => {
                        event.currentTarget.style.border = `1px solid ${getColorLevel(mainColor, 20)}`
                    }}
                />
                <div className={styles._send}>
                    <Button
                        label=''
                        icon={<IoSendOutline />}
                        iconSize={20}
                        width={40}
                        height={40}
                        onClick={handleSendMessage}
                        disabled={!isMessageComplete || text.trim().length === 0}
                        theme={'default'}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(SendMessage)