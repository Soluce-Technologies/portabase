export function truncateWords(text: string, wordLimit: number = 10): string {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "…";
}

export function capitalizeFirstLetter(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export function isUUID(str: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}