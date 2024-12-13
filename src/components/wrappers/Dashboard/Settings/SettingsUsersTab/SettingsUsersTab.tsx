import {User} from "@prisma/client";
import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {usersColumns} from "@/components/wrappers/Dashboard/Settings/SettingsUsersTab/columns-users";
import {UsersDataTable} from "@/components/wrappers/Dashboard/admin/admin-user-table";


export type SettingsUsersTabProps = {
    currentUser: User;
    users: User[]
}

export const SettingsUsersTab = (props: SettingsUsersTabProps) => {

    const {currentUser, users} = props;

    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>List of organization's users</h1>
            </div>
            <div className="mt-5">
                <DataTableWithPagination
                    columns={usersColumns}
                    data={users}
                    DataTable={UsersDataTable}
                    dataTableProps={{currentUser}}
                />
            </div>
        </div>
    )
}