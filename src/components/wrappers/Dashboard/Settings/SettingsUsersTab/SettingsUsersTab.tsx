import {DataTableWithPagination} from "@/components/wrappers/table/data-table-with-pagination";
import {usersColumns} from "@/components/wrappers/Dashboard/Settings/SettingsUsersTab/columns-users";
import {User} from "@prisma/client";


export type SettingsUsersTabProps = {
    users: User[]
}

export const SettingsUsersTab = (props: SettingsUsersTabProps) => {
    return (

        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>List of Portabase users</h1>
            </div>
            <div className="mt-5">
                <DataTableWithPagination columns={usersColumns} data={props.users}/>
            </div>
        </div>
    )
}