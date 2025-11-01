"use client"

import type React from "react"
import { useState, useRef, useEffect, forwardRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface IEntry {
    value: string
    label: string
}

interface SearchInputProps {
    value?: IEntry
    onChange?: (value: IEntry) => void
    onSelect?: (value: IEntry) => void
    name?: string
    placeholder?: string
    entries?: IEntry[]
    disabled?: boolean
    className?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value: controlledValue,
            onChange,
            onSelect,
            name,
            placeholder = "Search entries...",
            entries = [],
            disabled = false,
            className,
            ...props
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = useState<IEntry | null>(null)
        const [isOpen, setIsOpen] = useState(false)
        const [filteredEntries, setFilteredEntries] = useState<IEntry[]>([])
        const [selectedIndex, setSelectedIndex] = useState(-1)
        const internalRef = useRef<HTMLInputElement>(null)
        const listRef = useRef<HTMLUListElement>(null)

        const query = controlledValue?.label ?? internalValue?.label ?? ""
        const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

        // Filter entries based on query
        useEffect(() => {
            if (query.trim()) {
                const filtered = entries.filter((entry) =>
                    entry.label.toLowerCase().includes(query.toLowerCase()),
                )
                setFilteredEntries(filtered)
                setSelectedIndex(-1)
            } else {
                setFilteredEntries([])
            }
        }, [query, entries])

        const handleValueChange = (newValue: IEntry | null) => {
            if (controlledValue === undefined) {
                setInternalValue(newValue)
            }
            if (newValue) {
                onChange?.(newValue)
            }
        }

        // Handle keyboard navigation
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (!isOpen || filteredEntries.length === 0) return

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    setSelectedIndex((prev) =>
                        prev < filteredEntries.length - 1 ? prev + 1 : 0,
                    )
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredEntries.length - 1,
                    )
                    break
                case "Enter":
                    e.preventDefault()
                    if (selectedIndex >= 0) {
                        handleSelect(filteredEntries[selectedIndex])
                    }
                    break
                case "Escape":
                    setIsOpen(false)
                    setSelectedIndex(-1)
                    inputRef.current?.blur()
                    break
            }
        }

        const handleSelect = (entry: IEntry) => {
            handleValueChange(entry)
            onSelect?.(entry)
            setIsOpen(false)
            setSelectedIndex(-1)
            inputRef.current?.blur()
        }

        const clearSearch = () => {
            handleValueChange(null)
            setIsOpen(false)
            setSelectedIndex(-1)
            inputRef.current?.focus()
        }

        return (
            <div className={cn("relative w-full", className)}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        {...props}
                        ref={inputRef}
                        type="text"
                        name={name}
                        placeholder={placeholder}
                        value={query}
                        disabled={disabled}
                        onChange={(e) => {
                            const newLabel = e.target.value
                            handleValueChange({ value: newLabel, label: newLabel })
                        }}
                        onFocus={() => !disabled && setIsOpen(true)}
                        onBlur={() => {
                            // Delay closing to allow clicking on entries
                            setTimeout(() => setIsOpen(false), 150)
                        }}
                        onKeyDown={handleKeyDown}
                        className="pl-10 pr-10"
                    />
                    {query && !disabled && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Results dropdown */}
                {isOpen && !disabled && filteredEntries.length > 0 && (
                    <div className="absolute top-full z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                        <ul ref={listRef} className="max-h-60 overflow-auto py-1" role="listbox">
                            {filteredEntries.map((entry, index) => (
                                <li
                                    key={entry.value}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    className={cn(
                                        "px-3 py-2 text-sm cursor-pointer transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        index === selectedIndex && "bg-accent text-accent-foreground",
                                    )}
                                    onClick={() => handleSelect(entry)}
                                >
                                    {entry.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* No results message */}
                {isOpen && !disabled && query && filteredEntries.length === 0 && (
                    <div className="absolute top-full z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            No results found for "{query}"
                        </div>
                    </div>
                )}
            </div>
        )
    },
)

SearchInput.displayName = "SearchInput"
