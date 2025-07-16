import {format} from "date-fns";

export function humanReadableDate(rawDate: string | number | Date) {
    return formatFrenchDate(rawDate);
}

export function timeAgo(rawDate: string | number | Date) {
    const date = new Date(rawDate)
    return "Not implemented"
}

export function formatDateLastContact(lastContact: string | number | Date | null) {
    console.log(lastContact)
    return lastContact
        ? formatFrenchDate(lastContact)
        : "Never connected."
}

export function formatFrenchDate(date: string | number | Date) {
    return new Date(date).toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
    });
}