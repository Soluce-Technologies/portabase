"use client"

import {TablePaginationNavigation} from "@/components/wrappers/table/table-pagination-navigation";
import {TablePaginationSize} from "@/components/wrappers/table/table-pagination-size";
import {cn} from "@/lib/utils";

interface tablePaginationProps {
    className?: string
    table: any
    maxVisiblePages?: number
}

export function TablePagination(props: tablePaginationProps) {

    const {className, table, maxVisiblePages = 3} = props

    return (
        <div className={cn("flex justify-between mt-8", className)}>
            <TablePaginationSize table={table}/>
            <TablePaginationNavigation table={table} maxVisiblePages={maxVisiblePages}/>
        </div>
    )
}
