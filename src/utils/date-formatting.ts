import {format} from "date-fns";

export function humanReadableDate(rawDate: string | number | Date) {
    return format(new Date(rawDate), 'dd/MM/yyyy HH:mm')
}

export function timeAgo(rawDate: string | number | Date) {
    const date = new Date(rawDate)
    return "Not implemented"
}