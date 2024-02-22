'use client'
import React, { FC, ReactElement, ReactNode, useState, MouseEvent, useEffect, useRef, ButtonHTMLAttributes, memo } from 'react'
import styles from '@/components/forms/button.module.sass'
import {
    whiteColor, blackGradientColor, mainGradientColor,
    whiteGradientColor,
    redGradientColor,
    greenGradientColor,
    yellowGradientColor,
    mainColor,
    getColorLevel,
    geminiColor,
    geminiGradientColor,
}
    from '@/variables'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    width?: number | string
    height?: number | string
    label?: string
    textSize?: number | string
    textWeight?: number
    iconSize?: number | string
    icon?: ReactNode | ReactElement
    className?: string
    borderRadius?: number | string
    theme?: 'daibl' | 'light' | 'dark' | 'danger' | 'warning' | 'success' | 'gemini' | 'geminiLight'
    iconPosition?: 'left' | 'right'
    link?: string
    onClick?: () => void
}

const Button: FC<ButtonProps> = ({
    width = 'fit-content',
    height = 45,
    label = 'Button',
    textSize = 17,
    iconSize = 20,
    icon,
    className,
    borderRadius = '8px',
    theme = 'daibl',
    iconPosition = 'left',
    textWeight = 500,
    link,
    onClick,
    ...rest
}) => {

    const themeColors = {
        daibl: mainGradientColor,
        light: whiteGradientColor,
        dark: blackGradientColor,
        danger: redGradientColor,
        warning: yellowGradientColor,
        success: greenGradientColor,
        gemini: geminiGradientColor,
        geminiLight: whiteColor,
    }

    const [bubblePosition, setBubblePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [bubble, setBubble] = useState<boolean>(false)

    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const bubbleTimeout = setTimeout(() => setBubble(false), 300)
        return () => clearTimeout(bubbleTimeout)
    }, [bubble])

    useEffect(() => {
        if (buttonRef.current) {
            const buttonWidth = buttonRef.current.offsetWidth
            buttonRef.current.style.setProperty('--button-width', `${buttonWidth}px`)
        }
    }, [])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (link) {
            link && window.open(link, "_blank")
        } else {
            const buttonRect = event.currentTarget.getBoundingClientRect()
            setBubblePosition({
                x: event.clientX - buttonRect.left,
                y: event.clientY - buttonRect.top,
            })
            setBubble(true)
            onClick && onClick()
        }
    }

    const containerClassName = className ? `${styles._container} ${className}` : styles._container

    return (
        <button
            className={containerClassName}
            onClick={handleClick}
            ref={buttonRef}
            style={{
                width: width,
                height: height,
                fontSize: textSize,
                fontWeight: textWeight,
                background: themeColors[theme],
                borderRadius: borderRadius,
                color: theme === 'light' ? mainColor : theme === 'geminiLight' ? geminiColor : whiteColor,
                border: theme === 'light' ? `1px solid ${getColorLevel(mainColor, 20)}` : theme === 'geminiLight' ? `1px solid ${getColorLevel(geminiColor, 20)}` : 'none',
                flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
            }}
            {...rest}
        >
            {icon &&
                <div
                    className={styles._icon}
                    style={{
                        fontSize: iconSize
                    }}
                >
                    {icon}
                </div>
            }
            {label}
            {bubble && (
                <span
                    className={styles._bubble}
                    style={{
                        top: bubblePosition.y,
                        left: bubblePosition.x,
                        background: theme === 'light' || theme === 'geminiLight' ? getColorLevel(mainColor, 15) : getColorLevel(whiteColor, 25)
                    }}
                >
                </span>
            )}
        </button>
    )
}

export default memo(Button)