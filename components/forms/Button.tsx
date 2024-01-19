'use client'
import React, { FC, ReactElement, ReactNode, useState, MouseEvent, useEffect, useRef, ButtonHTMLAttributes } from 'react'
import styles from '@/components/forms/button.module.sass'
import {
    blackColor, whiteColor, blackGradientColor, mainGradientColor,
    whiteGradientColor,
    redGradientColor,
    greenGradientColor,
    yellowGradientColor,
    mainColor,
    getColorLevel
}
    from '@/components/variables'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    width?: number | string
    height?: number | string
    label?: string
    textSize?: number | string
    iconSize?: number | string
    icon?: ReactNode | ReactElement
    className?: string
    theme?: 'default' | 'light' | 'dark' | 'danger' | 'warning' | 'success'
    iconPosition?: 'left' | 'right'
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
    theme = 'default',
    iconPosition = 'left',
    onClick,
    ...rest
}) => {

    const themeColors = {
        default: mainGradientColor,
        light: whiteGradientColor,
        dark: blackGradientColor,
        danger: redGradientColor,
        warning: yellowGradientColor,
        success: greenGradientColor,
    }

    const [bubblePosition, setBubblePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [bubble, setBubble] = useState<boolean>(false)

    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const bubbleTimeout = setTimeout(() => setBubble(false), 500)
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
        const buttonRect = event.currentTarget.getBoundingClientRect()
        setBubblePosition({
            x: event.clientX - buttonRect.left,
            y: event.clientY - buttonRect.top,
        })
        setBubble(true)
        onClick && onClick()
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
                background: themeColors[theme],
                color: theme === 'light' ? mainColor : whiteColor,
                border: theme === 'light' ? `1px solid ${getColorLevel(mainColor, 20)}` : 'none',
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
                        background: theme === 'light' ? getColorLevel(mainColor, 15) : getColorLevel(whiteColor, 25)
                    }}
                >
                </span>
            )}
        </button>
    )
}

export default Button