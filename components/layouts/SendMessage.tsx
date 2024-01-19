'use client'
import { FC, useState } from 'react'
import styles from '@/components/layouts/sendmessage.module.sass'
import TextArea from '@/components/forms/TextArea'
import Button from '@/components/forms/Button'
import { IoSendOutline } from 'react-icons/io5'
import IMessage from '@/interfaces/message'
import { ref, set } from 'firebase/database'
import db from '@/firebase/db'
import axios from 'axios'

interface SendMessageProps {

}

const SendMessage: FC<SendMessageProps> = ({ }) => {

    const userId = localStorage.getItem('DAIBL_userId')

    const [text, setText] = useState<string>('')

    const handleSendMessage = async () => {
        if (text.trim()) {
            const id = Date.now().toString()
            const newMessage: IMessage = {
                id: id,
                text: text,
                isComplete: true,
                isResult: false,
            }
            // set(ref(db, `/data/${userId}/messages/${id}`), newMessage)
            setText('')
            try {
                const response = await axios.post('https://thanhdaibl.pythonanywhere.com')
                console.log(response.data)
            } catch (error) {
                console.error('Error sending POST request:', error)
            }
        }
    }

    return (
        <div className={styles._container}>
            <div className={styles._form}>
                <TextArea
                    width={'100%'}
                    height={60}
                    inputWidth={'100%'}
                    inputHeight={60}
                    placeholder='Viết bình luận tại đây'
                    value={text}
                    onChange={event => setText(event.target.value)}
                />
                <div className={styles._send}>
                    <Button
                        label=''
                        icon={<IoSendOutline />}
                        iconSize={20}
                        width={40}
                        height={40}
                        onClick={handleSendMessage}
                        disabled={text.trim() ? false : true}
                    />
                </div>
            </div>
        </div>
    )
}

export default SendMessage