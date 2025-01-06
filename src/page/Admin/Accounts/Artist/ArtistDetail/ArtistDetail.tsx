import styles from "./styles.module.scss";
import AccountsBreadcrumb from "../../AccountsBreadcrumb/AccountsBreadcrumb";

const ArtistDetail = () => {
  return (
    <div className={styles.container}>
      <AccountsBreadcrumb
        stage1Link="/label/accounts-management/artist"
        stage1Title="Artists"
        stage2Link="/label/accounts-management/artist/:id"
        stage2Title="1adfaf"
      />
    </div>
  );
};

export default ArtistDetail;
