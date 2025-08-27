export function truncateWords(text: string, wordLimit: number = 10): string {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "…";
}

export function capitalizeFirstLetter(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}
