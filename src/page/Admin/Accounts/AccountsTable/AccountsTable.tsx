import React, {useState} from "react";
import styles from "./styles.module.scss";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {User} from "@/interface/User";
import useAccountStore from "@/store/useAccountStore";
import {Button} from "@/components/ui/button";

interface AccountsTableProps {
    data: User[];
}

const AccountsTable: React.FC<AccountsTableProps> = ({data}) => {
    const {setId, setShowPopup, showDelete, setShowDelete, setShowPopupDelete, setIdsToDelete} = useAccountStore();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const handleRowClick = (accountId: string) => {
        setId(accountId);
        setShowPopup(true);
    };

    const handleDeleteToggle = () => {
        setShowDelete(!showDelete);
    };

    const handleCheckboxChange = (accountId: string) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(accountId)
                ? prevSelectedRows.filter((id) => id !== accountId)
                : [...prevSelectedRows, accountId]
        );
    };

    const handleDelete = () => {
        setIdsToDelete(selectedRows);
        setShowPopupDelete(true)
    };


    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="text-lg">
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead className="w-[50px]">Avatar</TableHead>
                        <TableHead className="w-[300px]">Display Name</TableHead>
                        <TableHead className="w-[300px]">Username</TableHead>
                        <TableHead className="w-[300px]">Email</TableHead>
                        <TableHead className="text-right w-[100px]">Status</TableHead>
                        {showDelete && <TableHead className="w-[100px]">Delete</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((account: User, index: number) => (
                        <TableRow key={index} className="cursor-pointer">
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="w-[100px]">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell
                                className="hover:underline"
                                onClick={() => handleRowClick(account._id)}
                            >
                                {account.profile?.displayName}
                            </TableCell>
                            <TableCell
                                className="font-medium hover:underline"
                                onClick={() => handleRowClick(account._id)}
                            >
                                {account.username}
                            </TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell className="text-right">Active</TableCell>
                            {showDelete && (
                                <TableCell className="w-[100px]">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(account._id)}
                                        onChange={() => handleCheckboxChange(account._id)}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className={styles["delete-wrapper"]}>
                <Button onClick={handleDeleteToggle} className={styles.deleteButton}>
                    {showDelete ? "Hide Delete" : "Show Delete"}
                </Button>

                {showDelete && (
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className={styles.deleteButton}
                        disabled={selectedRows.length === 0}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </>
    );
};

export default AccountsTable;
