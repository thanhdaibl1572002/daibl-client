import { FC, ReactElement, ReactNode, memo } from 'react'
import styles from '@/components/common/logo.module.sass'
import Link from 'next/link'
import { mainColor } from '@/components/variables'
import { SiNintendogamecube } from 'react-icons/si'

interface LogoProps {
  logoIcon?: ReactNode | ReactElement
  logoText?: string
  iconSize?: number | string
  iconColor?: string
  textSize?: number | string
  textColor?: string
}

const Logo: FC<LogoProps> = ({
  logoIcon = <SiNintendogamecube />,
  iconSize = 32,
  iconColor = mainColor,
  textSize = '13.5px',
  textColor = mainColor,
  logoText = 'DaiBL',
}) => {
  return (
    <Link 
        href={'/'}
        className={styles._container}
    >
      <span 
        style={{ 
          fontSize: iconSize,
          color: iconColor,
        }}
      >
        {logoIcon}
      </span>
      <h1
        style={{
          fontSize: textSize,
          color: textColor
        }}
      >
        {logoText}
      </h1>
    </Link>
  )
}

export default memo(Logo)