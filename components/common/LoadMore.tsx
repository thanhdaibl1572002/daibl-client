import { FC } from 'react'
import styles from '@/components/common/loadmore.module.sass'
import Image from 'next/image'
import { mainColor } from '@/components/variables'

interface LoadMoreProps {

}
  
  const LoadMore: FC<LoadMoreProps> = ({}) => {
    return (
      <div className={styles._container}>
        <span></span>
      </div>
    )
  }
  
  export default LoadMore