import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";

export type dataTableProps = {
    table: any
}

export const DataTable = ({table}: dataTableProps) => {

    return (
        <div className="rounded-md border w-full ">
            <Table className="w-full">

                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
// import { useMemo } from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { flexRender } from "@tanstack/react-table";
//
// export type dataTableProps = {
//     table: any;
// };
//
// export const DataTable = ({ table }: dataTableProps) => {
//     // Memoize the header and rows to prevent unnecessary re-renders
//     const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);
//     const rows = useMemo(() => table.getRowModel().rows, [table]);
//
//     return (
//         <div className="rounded-md border w-full ">
//             <Table className="w-full">
//                 <TableHeader>
//                     {headerGroups.map((headerGroup) => (
//                         <TableRow key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => (
//                                 <TableHead key={header.id}>
//                                     {header.isPlaceholder
//                                         ? null
//                                         : flexRender(header.column.columnDef.header, header.getContext())}
//                                 </TableHead>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableHeader>
//                 <TableBody>
//                     {rows?.length ? (
//                         rows.map((row) => (
//                             <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                                 {row.getVisibleCells().map((cell) => (
//                                     <TableCell key={cell.id}>
//                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
//                                 No results.
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };
