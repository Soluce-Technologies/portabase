"use client"

import {TablePaginationNavigation} from "@/components/wrappers/table/table-pagination-navigation";
import {TablePaginationSize} from "@/components/wrappers/table/table-pagination-size";
import {cn} from "@/lib/utils";

interface tablePaginationProps {
    className?: string
    table: any
    maxVisiblePages?: number
    pageSizeOptions?: number[]
}

export function TablePagination(props: tablePaginationProps) {

    const {className, table, maxVisiblePages = 3, pageSizeOptions = [10, 20, 30, 40, 50]} = props

    return (
        <div className={cn("flex mt-6", className)}>
            <TablePaginationSize table={table} pageSizeOptions={pageSizeOptions}/>
            <TablePaginationNavigation table={table} maxVisiblePages={maxVisiblePages} className="justify-end"/>
        </div>
    )
}
