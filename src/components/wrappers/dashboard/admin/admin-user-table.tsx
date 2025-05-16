import { usersColumnsAdmin } from "@/components/wrappers/dashboard/admin/columns-users";
import { User } from "@/db/schema/01_user";
import { DataTable } from "../../common/table/data-table";

export type AdminUsersTableProps = {
    users: User[];
};

export const AdminUsersTable = (props: AdminUsersTableProps) => {
    const { users } = props;
    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>List of Portabase's users</h1>
            </div>
            <div className="mt-5">
                <DataTable columns={usersColumnsAdmin} data={users} />
            </div>
        </div>
    );
};
