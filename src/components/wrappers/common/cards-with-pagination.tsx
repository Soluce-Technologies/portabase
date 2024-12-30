'use client'

import React, {useState} from 'react'
import {cn} from "@/lib/utils";

import {PaginationNavigation} from "@/components/wrappers/common/pagination/pagination-navigation";

export type cardsWithPaginationProps = {
    className?: string
    organizationSlug?:string
    data: Array<{}>;
    cardItem: React.ComponentType;
    cardsPerPage?: number
    numberOfColumns?: number
    maxVisiblePages?: number
    extendedProps?: any
}


export const CardsWithPagination = (props: cardsWithPaginationProps) => {

    const {className,organizationSlug, data, cardItem, cardsPerPage = 5, numberOfColumns = 1, maxVisiblePages = 3} = props

    const CardItem = cardItem

    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(data.length / cardsPerPage)

    const indexOfLastCard = currentPage * cardsPerPage
    const indexOfFirstCard = indexOfLastCard - cardsPerPage
    const currentCards = data.slice(indexOfFirstCard, indexOfLastCard)

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const goToPrevPage = () => {
        goToPage(Math.max(1, currentPage - 1))
    }

    const goToNextPage = () => {
        goToPage(Math.min(totalPages, currentPage + 1))
    }

    return (
        <div className={cn("flex flex-col h-full justify-between", className)}>
            <div className={cn(`grid h-max auto-rows-min gap-4 md:grid-cols-${numberOfColumns}`)}>
                {currentCards.map((card, key) => (
                    <CardItem key={key} data={card} organizationSlug={organizationSlug} extendedProps={props.extendedProps} />
                ))}
            </div>
            <PaginationNavigation
                className="justify-end"
                totalPages={totalPages}
                currentPage={currentPage}
                goToPage={goToPage}
                goToPrevPage={goToPrevPage}
                goToNextPage={goToNextPage}
                maxVisiblePages={maxVisiblePages}/>
        </div>
    )
}