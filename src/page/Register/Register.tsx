import styles from './styles.module.scss'
import img from '../../assets/img/registerPage.jpg'
import RegisterForm from '@/shared/components/registerForm/RegisterForm';
import RegisterHeading from '@/shared/components/registerHeading/RegisterHeading';

const Register = () => {
    return (
        <div className={styles.container}>
          <div className={styles["img-wrapper"]}>
            <img src={img} alt="" />
          </div>
          <div className={styles["content-wrapper"]}>
            <RegisterHeading role="Advertiser" />
            <RegisterForm />
          </div>
        </div>
      );
}

export default Register