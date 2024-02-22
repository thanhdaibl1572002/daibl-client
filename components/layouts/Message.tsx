/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from '@/components/layouts/message.module.sass'
import { IoCheckmarkCircleOutline, IoCopyOutline } from 'react-icons/io5'
import IMessage from '@/interfaces/message'
import { ref, set } from 'firebase/database'
import db from '@/firebase/db'
import { useMessageContext } from '@/providers/MessageProvider'
import Button from '@/components/forms/Button'
import { getColorLevel, mainGradientColor, mainColor, geminiColor, geminiGradientColor } from '@/components/variables'
import { useModeContext } from '@/providers/ModeProvider'
import { SiGooglebard, SiNintendogamecube } from 'react-icons/si'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

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
    const textResultRef = useRef<HTMLUListElement>(null)

    const { mode } = useModeContext()
    const { setIsMessageComplete } = useMessageContext()

    const copyToClipboard = (): void => {
        const content = textResultRef.current!.textContent
        content && navigator.clipboard.writeText(content.replace(/\s+/g, ' ').trim())
    }

    useEffect(() => setIsMessageComplete(isComplete), [])

    useEffect(() => {
        if (isResult && !isComplete) {
            let index = 0
            const textInterval = setInterval(() => {
                setMessageText(text.slice(0, index))
                index++
                let parentElement = messageRef.current!.parentNode as Element
                const isAtBottom = parentElement!.scrollTop + parentElement!.clientHeight >= parentElement!.scrollHeight - 40
                isAtBottom && (parentElement!.scrollTop = parentElement!.scrollHeight)
                index > text.length && clearInterval(textInterval)
            }, 20)
            return () => clearInterval(textInterval)
        }
    }, [id, text, isResult, isComplete])

    useEffect(() => {
        if (messageText.length === text.length && isResult && !isComplete) {
            const newMessage: IMessage = {
                id: id,
                text: text,
                isComplete: true,
                isResult: true,
            }
            const userId = localStorage.getItem('DAIBL_userId')
            userId && set(ref(db, `/${mode}/${userId}/messages/${id}`), newMessage)
            setIsMessageComplete(true)
        }
    }, [messageText, id, text, isResult, isComplete, setIsMessageComplete])

    return (
        <div
            className={styles._container}
            ref={messageRef}
        >
            {isResult ? (
                <div
                    className={styles._result}
                    style={{ border: `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 10)}` }}
                >
                    {
                        isComplete && (
                            <a href='#' className={styles._copy}>
                                <Button
                                    label=''
                                    icon={<IoCopyOutline />}
                                    iconSize={22}
                                    width={32}
                                    height={32}
                                    theme={mode === 'daibl' ? 'light' : 'geminiLight'}
                                    borderRadius={5}
                                    onClick={copyToClipboard}
                                />
                            </a>
                        )
                    }
                    <span
                        style={{
                            border: `1px solid ${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 5)}`,
                            background: `${getColorLevel(mode === 'daibl' ? mainColor : geminiColor, 5)}`
                        }}
                    >
                        {
                            mode === 'daibl'
                                ? <SiNintendogamecube style={{ color: mainColor }} />
                                : <SiGooglebard style={{ color: geminiColor }} />
                        }
                        {isComplete ? (
                            <>
                                Đã trả lời xong
                                <IoCheckmarkCircleOutline style={{ color: mode === 'daibl' ? mainColor : geminiColor }} />
                            </>
                        ) : (
                            <>
                                {
                                    messageText.length === text.length
                                        ? <>
                                            Đã trả lời xong
                                            <IoCheckmarkCircleOutline style={{ color: mode === 'daibl' ? mainColor : geminiColor }} />
                                        </>
                                        : `${mode.toUpperCase()} đang tạo câu trả lời ...`
                                }
                            </>
                        )}
                    </span>
                    <span
                        className={styles._result__text}
                        ref={textResultRef}
                    >
                        {isComplete
                            ? <Markdown 
                                rehypePlugins={[rehypeRaw, remarkGfm]}
                                components={{}}
                            >
                                {text}
                            </Markdown>
                            : <Markdown 
                                rehypePlugins={[rehypeRaw, remarkGfm]}
                                components={{}}
                            >
                                {messageText}
                            </Markdown>
                        }
                    </span>
                </div>
            ) : (
                <p
                    className={styles._comment}
                    style={{
                        background: mode === 'daibl' ? mainGradientColor : geminiGradientColor
                    }}
                >
                    {text}
                </p>
            )}
        </div>
    )
}

export default memo(Message)