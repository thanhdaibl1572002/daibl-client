'use client'
import { FC, ReactElement, ReactNode, TextareaHTMLAttributes, memo, useState } from 'react'
import { IoAlertCircleOutline } from 'react-icons/io5'
import styles from '@/components/forms/textarea.module.sass'
import { getColorLevel, mainColor } from '@/components/variables'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  width?: number | string
  height?: number | string
  inputWidth?: number | string
  inputHeight?: number | string
  padding?: string
  label?: string
  labelIcon?: ReactNode | ReactElement
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string | number
  errorMessage?: string
  className?: string
  borderRadius?: number
  border?: string
}

const TextArea: FC<TextAreaProps> = ({
  width = 'fit-content',
  height = 'fit-content',
  inputWidth = '100%',
  inputHeight = 100,
  padding = '15px',
  label,
  labelIcon,
  id,
  name,
  placeholder,
  defaultValue,
  errorMessage,
  className,
  borderRadius = 8,
  border = `border: 1px solid ${getColorLevel(mainColor, 20)}`,
  ...rest
}) => {

  const containerClassName = className ? `${styles._container} ${className}` : styles._container

  return (
    <div 
      className={containerClassName} 
      style={{
        width: width,
        height: height,
      }}
    >
      {label && <label htmlFor={id}>{labelIcon}{label}</label>}
      <div className={styles._input}>
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          style={{
            width: inputWidth,
            height: inputHeight,
            borderRadius: borderRadius,
            padding: padding,
            border: border,
          }}
          {...rest}
        />
      </div>
      {errorMessage && <span><IoAlertCircleOutline />{errorMessage}</span>}
    </div>
  )
}

export default memo(TextArea)