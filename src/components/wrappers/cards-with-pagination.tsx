'use client'

import React, {useState} from 'react'
import {Card} from "@/components/ui/card"
import {cn} from "@/lib/utils";
import {
    Pagination, PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";

export type cardsWithPaginationProps = {
    data: Array<{}>;
    cardItem: React.ComponentType;
    cardsPerPage?: number
    numberOfColumns?: number
}


export const CardsWithPagination = (props: cardsWithPaginationProps) => {

    const {data, cardItem, cardsPerPage = 5, numberOfColumns = 1} = props

    const CardItem = cardItem

    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(data.length / cardsPerPage)

    const indexOfLastCard = currentPage * cardsPerPage
    const indexOfFirstCard = indexOfLastCard - cardsPerPage
    const currentCards = data.slice(indexOfFirstCard, indexOfLastCard)

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = 3

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis/>
                    </PaginationItem>
                )
            } else if (currentPage >= totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis/>
                    </PaginationItem>
                )
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
            } else {
                items.push(
                    <PaginationItem key="ellipsis3">
                        <PaginationEllipsis/>
                    </PaginationItem>
                )
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
                items.push(
                    <PaginationItem key="ellipsis4">
                        <PaginationEllipsis/>
                    </PaginationItem>
                )
            }
        }

        return items
    }

    return (
        <div className="">
            <div className={cn(`grid auto-rows-min gap-4 md:grid-cols-${numberOfColumns}`)}>
                {currentCards.map((card, key) => (
                    <CardItem key={key} {...card}/>
                ))}
            </div>
            <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            aria-disabled={currentPage === 1}
                            tabIndex={currentPage === 1 ? -1 : 0}
                        />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            aria-disabled={currentPage === totalPages}
                            tabIndex={currentPage === totalPages ? -1 : 0}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}