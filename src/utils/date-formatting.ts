import {format} from "date-fns";

export function humanReadableDate(rawDate: string | number | Date) {
    return format(new Date(rawDate), 'dd/MM/yyyy HH:mm')
}

export function timeAgo(rawDate: string | number | Date) {
    const date = new Date(rawDate)
    return "Not implemented"
}

export function formatDateLastContact(lastContact: string | number | Date | null) {
    console.log(lastContact)
    return lastContact
        ? format(new Date(lastContact), 'dd/MM/yyyy HH:mm')
        : "Never connected."
}