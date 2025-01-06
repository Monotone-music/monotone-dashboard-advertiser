import styles from './styles.module.scss'
import { RxHamburgerMenu } from "react-icons/rx";

const DropdownMenu = () => {
  return (
    <div className={styles.container}>
        <div className={styles.title}>
            Monotone Studio
        </div>
        <div className={styles.icon}>
            <RxHamburgerMenu/>
        </div>
    </div>
  )
}

export default DropdownMenu