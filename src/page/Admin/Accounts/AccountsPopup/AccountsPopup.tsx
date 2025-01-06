import React from "react";
import styles from "./styles.module.scss";
import { IoMdClose } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import {useAuthStore} from "@/store/useAuthStore";
import { getAccountsById } from "@/service/adminService";
import PuffLoader from "react-spinners/PuffLoader";
import { convertToTimezone } from "@/util/ConvertISODate";


interface AccountsPopupProps {
  accountId: string | null;
  onClose: () => void;
}

const AccountsPopup: React.FC<AccountsPopupProps> = ({ accountId, onClose }) => {
  const { token } = useAuthStore();
  const {data, isFetching, error, isError} = useQuery({
    queryKey: ["artist", token, accountId],
    queryFn: () => getAccountsById(token, accountId)
  })

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.container}>
        <div className={styles.top}>
          <button className={styles.closeButton} onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        <div className={styles.popupContent}>
          {isFetching ? (
            <div className={styles.loading}>
              <PuffLoader color="black" />
            </div>
          ) : (
            <>
              <div className={styles["name-wrapper"]}>
                <Avatar className="w-14 h-14">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className={styles.displayName}>
                  <span className={styles.name}>{data?.profile.displayName}</span>
                  <span className={styles.role}>{data?.role}</span>
                </div>
              </div>

              <div className={styles["info-wrapper"]}>
              <div className={styles.row}>
                  <div className={styles.label}>Username:</div>
                  <div className={styles.info}>{data?.username}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Email:</div>
                  <div className={styles.info}>{data?.email}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Status:</div>
                  <Switch />
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Created At:</div>
                  <div className={styles.info}>{convertToTimezone(data?.createdAt)}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Last Modified At:</div>
                  <div className={styles.info}>{convertToTimezone(data?.modifiedAt)}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Bio:</div>
                  <div className={styles.info}>{data?.profile.bio}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPopup;
