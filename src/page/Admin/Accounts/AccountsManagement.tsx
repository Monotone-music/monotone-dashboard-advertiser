import styles from './styles.module.scss'
import TitlePage from '@/shared/components/titlePage/TitlePage'
import RedirectCard from '@/shared/admin/RedirectCard/RedirectCard'
import { Outlet, useLocation } from 'react-router-dom'

const AccountListView = () => {
  return (
    <div className={styles['card-wrapper']}>
      <RedirectCard title={['Artist']} to='/label/accounts-management/artist'/>
      <RedirectCard title={['Music Label']} to='/label/accounts-management/music-label'/>
      <RedirectCard title={['Distributor']} to='/label/accounts-management/distributor'/>
      <RedirectCard title={['Advertiser']} to='/label/accounts-management/advertiser'/>
    </div>
  );
};

const AccountsManagement = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/label/accounts-management';

  return (
    <div className={styles.container}>
      <TitlePage title={['Accounts', 'Management']}/>

        {isRootPath ? <AccountListView /> : <Outlet />}
    </div>
  )
}

export default AccountsManagement