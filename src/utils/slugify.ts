export const slugify = (text: string) => {
    return text
        .toString()
        .normalize('NFKD')                   // Normalize accents
        .replace(/[\u0300-\u036f]/g, '')     // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/\_/g, '-')                // _ → dash
        .replace(/\s+/g, '-')               // spaces → dash
        .replace(/[^\w\-]+/g, '')           // Remove non-word chars
        .replace(/\-\-+/g, '-')             // multiple dashes → one
        .replace(/^-+/, '')                 // Remove leading dash
        .replace(/-+$/, '');                // Remove trailing dash
};