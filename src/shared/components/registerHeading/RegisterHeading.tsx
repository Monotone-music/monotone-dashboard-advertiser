import React from 'react'
import styles from './styles.module.scss'

interface RegisterHeadingProps {
    role?: string;
  }

const RegisterHeading:React.FC<RegisterHeadingProps> = ({role}) => {
  return (
    <div className={styles.heading}>
    <div className={styles.title}>
      <span>Welcome to Monotone Studio for <span className={styles.notation}>{role}</span>,</span>
      <span>Sign up to Continue</span>
    </div>
  </div>
  )
}

export default RegisterHeading