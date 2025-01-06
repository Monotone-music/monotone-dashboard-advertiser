import React, { useState } from 'react'
import styles from './styles.module.scss'
import { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom';

interface SideBtnProps {
  icon: IconType;
  iconHovered: IconType;
  title: string;
  to: string;
}

const SideBtn:React.FC<SideBtnProps> = ({icon,iconHovered , title, to}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <NavLink to={to} className={({isActive}) => (isActive ? `${styles.active}` : styles.container )} 
    onMouseEnter={() => setIsHover(true)}
    onMouseLeave={() => setIsHover(false)}
    >
        <div className={styles.icon}>
            {isHover ? React.createElement(iconHovered) : React.createElement(icon) }
        </div>
        <div className={styles.title}>{title}</div>
    </NavLink>
  )
}

export default SideBtn