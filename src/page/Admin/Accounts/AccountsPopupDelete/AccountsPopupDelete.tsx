import styles from "./styles.module.scss";
import { Button } from "@/components/ui/button";
import useAccountStore from "@/store/useAccountStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccountsByIds } from "@/service/adminService";
import {useAuthStore} from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";

const AccountsPopupDelete = () => {
  const { token } = useAuthStore();
  const { toast } = useToast()
  const { idsToDelete, setShowPopupDelete, setIdsToDelete } = useAccountStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteAccountsByIds(token, idsToDelete),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
      setShowPopupDelete(false);
      setIdsToDelete([]);   
      toast({
        title: "Success",
        description: "Accounts have been successfully deleted.",
        className: styles.toastSuccess
      });
      
    },
    onError: (error) => {
      console.error("Failed to delete accounts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete accounts. Please try again.",
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  const handleCancel = () => {
    setIdsToDelete([]);
    setShowPopupDelete(false);
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.container}>
        <div className={styles["content-wrapper"]}>
          <div className={styles.title}>Delete Confirmation</div>
          <div className={styles.content}>
            Are you sure you want to delete this item? This action cannot be
            undone, and all associated data will be permanently removed.
          </div>
        </div>
        <div className={styles["btn-wrapper"]}>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={handleCancel} variant="secondary" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountsPopupDelete;
