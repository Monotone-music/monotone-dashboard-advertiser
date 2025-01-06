import React from 'react'
import styles from './styles.module.scss'
import useAccountStore from '@/store/useAccountStore';

interface AccountsMobileCard {
    displayName?: string;
    username? :string
    img?: string;
    id: string;
}

const AccountsMobileCard:React.FC<AccountsMobileCard> = ({displayName, username, id}) => {
      const {setId, setShowPopup} = useAccountStore()
    const handleRowClick = (accountId: string) => {
      setId(accountId);
      setShowPopup(true)
    };
  
  return (
    <div className={styles.container} onClick={() => handleRowClick(id)}>
        <div className={styles['img-wrapper']}>
            <img src="https://github.com/shadcn.png" alt="" />
        </div>

        <div className={styles['info-wrapper']}>
            <div className={styles['last-name']}>{username}</div>
            <div className={styles['first-name']}>{displayName}</div>
       
        </div>
    </div>
  )
}

export default AccountsMobileCard