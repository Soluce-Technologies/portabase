import {User, UserWithAccounts} from "@/db/schema/02_user";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DataTable} from "@/components/wrappers/common/table/data-table";
import {usersColumnsAdmin} from "@/components/wrappers/dashboard/admin/admin-user-tab/columns-users";

export type AdminUsersTableProps = {
    users: UserWithAccounts[];

};

export const AdminUsersTable = (props: AdminUsersTableProps) => {
    const {users} = props;
    return (
        <div className="flex flex-col gap-y-4 h-full py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Active users</CardTitle>
                    <CardDescription>Manage your users</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={usersColumnsAdmin} data={users}/>
                </CardContent>
            </Card>
        </div>
    );
};
