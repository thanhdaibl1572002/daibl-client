import { FC } from 'react'
import styles from '@/components/common/loadmore.module.sass'
import Image from 'next/image'
import { mainColor } from '@/variables'

interface LoadMoreProps {
  color?: string
}
  
  const LoadMore: FC<LoadMoreProps> = ({ color = mainColor }) => {
    return (
      <div className={styles._container}>
        <span style={{ color: color }}></span>
      </div>
    )
  }
  
  export default LoadMore