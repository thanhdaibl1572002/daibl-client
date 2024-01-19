'use client'
import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from '@/components/layouts/message.module.sass'
import Image from 'next/image'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import IMessage from '@/interfaces/message'
import {ref, set } from 'firebase/database'
import db from '@/firebase/db'

interface MessageProps {
    id: string
    text: string
    isResult?: boolean
    isComplete?: boolean
}

const Message: FC<MessageProps> = ({
    id,
    text,
    isResult = false,
    isComplete = false,
}) => {

    const [messageText, setMessageText] = useState<string>('')
    const messageRef = useRef<HTMLDivElement>(null)

    const userId = localStorage.getItem('DAIBL_userId')

    useEffect(() => {
        let index = 0
        const textInterval = setInterval(() => {
            setMessageText(text.slice(0, index))
            index++
            if (index > text.length)
                clearInterval(textInterval)
            else if (messageRef.current && isResult && !isComplete)
                messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }, 30)
        return () => clearInterval(textInterval)
    }, [id, text, isResult, isComplete])

    useEffect(() => {
        if (messageText.length === text.length && isResult && !isComplete) {
            const newMessage: IMessage = {
                id: id, 
                text: text, 
                isComplete: true,
                isResult: true, 
            }
            set(ref(db, `/data/${userId}/messages/${id}`), newMessage)
        }
    }, [messageText, id, text, isResult, isComplete, userId])

    return (
        <div
            className={styles._container}
            ref={messageRef}
        >
            {isResult ? (
                <p className={styles._result}>
                    <span>
                        <Image
                            src={'/images/common/logo.png'}
                            alt='DaiBL Logo'
                            width={25}
                            height={25}
                        />
                        {isComplete ? (
                            <>Đã trả lời xong <IoCheckmarkCircleOutline /></> 
                        ) : (
                            <>
                            {
                                messageText.length === text.length 
                                ? <>Đã trả lời xong <IoCheckmarkCircleOutline /></> 
                                : 'DAIBL đang tạo câu trả lời ...'
                            }
                            </>
                        )}
                    </span>
                    {isComplete ? text : messageText}
                </p>
            ) : (
                <p className={styles._comment}>
                    <span>
                        <Image
                            src={'/images/common/avatar.png'}
                            alt='DaiBL Logo'
                            width={25}
                            height={25}
                        />
                        Bình luận của bạn
                    </span>
                    {text}
                </p>
            )}
        </div>
    )
}

export default memo(Message)