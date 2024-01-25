import { FC, memo } from 'react'
import styles from '@/components/common/logo.module.sass'
import Image from 'next/image'
import Link from 'next/link'
import { mainColor } from '@/components/variables'

interface LogoProps {
  imageWidth?: number
  imageHeight?: number
  imageSrc?: string
  altText?: string
  logoText?: string
  textSize?: number | string
  textColor?: string
}

const Logo: FC<LogoProps> = ({
  imageWidth = 50,
  imageHeight = 50,
  altText = 'DAIBL Logo',
  imageSrc = '/images/common/logo.png',
  textSize = '13.5px',
  textColor = mainColor,
  logoText = 'DaiBL',
}) => {
  return (
    <Link 
        href={'/'}
        className={styles._container}
    >
        <Image 
          src={imageSrc}
          alt={altText}
          width={imageWidth}
          height={imageHeight}
        />
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