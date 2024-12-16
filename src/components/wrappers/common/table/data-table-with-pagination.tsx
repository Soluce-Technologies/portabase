"use client"

import {useState} from "react";

import {
    ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table"
import {DataTable as BaseDataTable} from "@/components/wrappers/common/table/data-table";
import {TablePagination} from "@/components/wrappers/common/table/table-pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    extendedProps?: any
    DataTable?: any
    dataTableProps?: any
}

export function DataTableWithPagination<TData, TValue>(props: DataTableProps<TData, TValue>) {

    const {columns, data, extendedProps, DataTable = BaseDataTable, dataTableProps} = props;


    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        meta: {
            extendedProps: extendedProps,
        }
    })

    return (
        <div className="flex flex-col justify-between h-full">
            <DataTable table={table} {...dataTableProps}/>
            <TablePagination table={table} pageSizeOptions={[5, 10, 20, 50, 100]}/>
        </div>
    )
}
