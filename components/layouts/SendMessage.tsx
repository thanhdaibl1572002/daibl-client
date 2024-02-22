'use client'
import { FC, memo, useCallback, useRef, useState } from 'react'
import styles from '@/components/layouts/sendmessage.module.sass'
import TextArea from '@/components/forms/TextArea'
import Button from '@/components/forms/Button'
import { IoSendOutline } from 'react-icons/io5'
import IMessage from '@/interfaces/message'
import { ref, set } from 'firebase/database'
import db from '@/firebase/db'
import axios from 'axios'
import { useMessageContext } from '@/providers/MessageProvider'
import { getColorLevel, mainColor, geminiColor } from '@/variables'
import generateRandomResponse from '@/utils/generateResponse'
import { useModeContext } from '@/providers/ModeProvider'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SendMessage: FC = () => {

    const [text, setText] = useState<string>('')

    const { mode } = useModeContext()
    const { isMessageComplete, setIsMessageComplete, isMessageLoading, setIsMessageLoading } = useMessageContext()

    const sendMessageRef = useRef<HTMLDivElement>(null)

    const daiblResponse = async (message: string, userId: string): Promise<void> => {
        try {
            setIsMessageLoading(true)
            const response = await axios.post(`${process.env.SERVER_LINK}/predict`, { comment: message })
            if (response.data.toString()) {
                const resultMessage: IMessage = {
                    id: Date.now().toString(),
                    text: '',
                    isComplete: false,
                    isResult: true,
                }
                if (response.data == '-2') {
                    resultMessage.text = `Bình luận "${message}" có thể không phải là tiếng Việt, điều
                    này có thể ảnh hưởng đến kết quả dự đoán của mô hình, vui lòng thử những bình luận khác.`
                }
                else if (response.data == '-1') {
                    resultMessage.text = generateRandomResponse(message, '**tiêu cực**')
                }
                else if (response.data == '0') {
                    resultMessage.text = generateRandomResponse(message, '**trung lập**')
                }
                else if (response.data == '1') {
                    resultMessage.text = generateRandomResponse(message, '**tích cực**')
                }
                set(ref(db, `/${mode}/${userId}/messages/${resultMessage.id}`), resultMessage)
            }
            setIsMessageComplete(true)
        } catch (error: unknown) {
            console.error('Error sending POST request:', error)
        } finally {
            setIsMessageLoading(false)
        }
    }

    const geminiResponse = async (message: string, userId: string): Promise<void> => {
        try {
            setIsMessageLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
            const result = await model.generateContent(message)
            const response = await result.response
            const resultMessage: IMessage = {
                id: Date.now().toString(),
                text: response.text(),
                isComplete: false,
                isResult: true,
            }
            set(ref(db, `/${mode}/${userId}/messages/${resultMessage.id}`), resultMessage)
            setIsMessageComplete(true)
        } catch (error: unknown) {
            console.error('Error sending POST request:', error)
        } finally {
            setIsMessageLoading(false)
        }
    }


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
                set(ref(db, `/${mode}/${userId}/messages/${id}`), newMessage)
                setIsMessageComplete(false)
                let parentElement = sendMessageRef.current!.parentNode as Element
                parentElement!.scrollTop = parentElement!.scrollHeight
                mode === 'daibl'
                    ? daiblResponse(newMessage.text, userId)
                    : geminiResponse(newMessage.text, userId)
            }
        }
    }

    return (
        <div
            className={styles._container}
            ref={sendMessageRef}
        >
            <div
                className={styles._form}
                style={{
                    border: `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 10)}`
                }}
            >
                <TextArea
                    width={'100%'}
                    height={50}
                    inputWidth={'100%'}
                    inputHeight={50}
                    padding='10px 55px 10px 12px'
                    border={`1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 20)}`}
                    placeholder={mode === 'daibl' ? 'Phân loại bình luận với DAIBL' : 'Trò chuyện với Gemini AI'}
                    value={text}
                    onChange={event => setText(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === 'Enter' && isMessageComplete && text.trim()) {
                            event.preventDefault()
                            handleSendMessage()
                        }
                    }}
                    onFocus={event => {
                        event.currentTarget.style.border = `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 80)}`
                    }}
                    onBlur={event => {
                        event.currentTarget.style.border = `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 20)}`
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
                        disabled={!isMessageComplete || isMessageLoading || text.trim().length === 0}
                        theme={mode}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(SendMessage)