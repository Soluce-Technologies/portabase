"use client"

import {useState} from "react";

import {
    ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table"
import {DataTable} from "@/components/wrappers/table/data-table";
import {TablePagination} from "@/components/wrappers/table/table-pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTableWithPagination<TData, TValue>({columns, data}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="flex flex-col justify-between h-full">
            <DataTable table={table}/>
            <TablePagination table={table} pageSizeOptions={[5, 10, 20, 50, 100]}/>
        </div>
    )
}
