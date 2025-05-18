import {usersColumns} from "@/components/wrappers/dashboard/settings/SettingsUsersTab/columns-users-settings";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {flexRender, Row} from "@tanstack/react-table";
import {cn} from "@/lib/utils";


export type SettingsUsersTabProps = {
    // currentUser: User;
    // users: UserOrganization[]
}

export const SettingsUsersTab = (props: SettingsUsersTabProps) => {

    // const {currentUser, users} = props;

    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>List of organization's users</h1>
            </div>
            <div className="mt-5">
                {/*<DataTableWithPagination*/}
                {/*    columns={usersColumns}*/}
                {/*    data={users}*/}
                {/*    DataTable={UsersDataTable}*/}
                {/*    dataTableProps={{currentUser}}*/}
                {/*/>*/}
            </div>
        </div>
    )
}



export type usersDataTableProps = {
    // currentUser: User;
    // table: any,
}

export const UsersDataTable = (
    // {currentUser, table}: usersDataTableProps
) => {

    return (
        <div className="rounded-md border w-full ">
            {/*<Table className="w-full">*/}
            {/*    <TableHeader>*/}
            {/*        {table.getHeaderGroups().map((headerGroup) => (*/}
            {/*            <TableRow key={headerGroup.id}>*/}
            {/*                {headerGroup.headers.map((header) => {*/}
            {/*                    return (*/}
            {/*                        <TableHead key={header.id}>*/}
            {/*                            {header.isPlaceholder*/}
            {/*                                ? null*/}
            {/*                                : flexRender(*/}
            {/*                                    header.column.columnDef.header,*/}
            {/*                                    header.getContext()*/}
            {/*                                )}*/}
            {/*                        </TableHead>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </TableRow>*/}
            {/*        ))}*/}
            {/*    </TableHeader>*/}
            {/*    <TableBody>*/}
            {/*        {table.getRowModel().rows?.length ? (*/}
            {/*            table.getRowModel().rows.map((row: Row<UserOrganization>) => {*/}
            {/*                    return(*/}
            {/*                        <TableRow*/}
            {/*                            className={cn((row.original.userId) === currentUser.id ? "opacity-40 pointer-events-none" : "")}*/}
            {/*                            key={row.id}*/}
            {/*                            data-state={row.getIsSelected() && "selected"}*/}
            {/*                        >*/}
            {/*                            {row.getVisibleCells().map((cell) => (*/}
            {/*                                <TableCell key={cell.id}>*/}
            {/*                                    {flexRender(*/}
            {/*                                        cell.column.columnDef.cell,*/}
            {/*                                        cell.getContext(),*/}
            {/*                                    )}*/}
            {/*                                </TableCell>*/}
            {/*                            ))}*/}
            {/*                        </TableRow>*/}
            {/*                    )*/}
            {/*                }*/}

            {/*            )) : (*/}
            {/*            <TableRow>*/}
            {/*                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">*/}
            {/*                    No results.*/}
            {/*                </TableCell>*/}
            {/*            </TableRow>*/}
            {/*        )}*/}
            {/*    </TableBody>*/}
            {/*</Table>*/}
        </div>
    )
}
