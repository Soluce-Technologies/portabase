export const isValidCronPart = (type: string, value: string): boolean => {
    const regexMap: Record<string, RegExp> = {
        minute: /^(\*|([0-5]?\d)|(\d+(,\d+)*|(\d+-\d+)|(\*\/\d+)))$/,
        hour: /^(\*|([01]?\d|2[0-3])|(\d+(,\d+)*|(\d+-\d+)|(\*\/\d+)))$/,
        "day-of-month": /^(\*|([1-9]|[12]\d|3[01])|(\d+(,\d+)*|(\d+-\d+)|(\*\/\d+)))$/,
        month: /^(\*|([1-9]|1[0-2])|(\d+(,\d+)*|(\d+-\d+)|(\*\/\d+)))$/,
        "day-of-week": /^(\*|[0-6]|(\d+(,\d+)*|(\d+-\d+)|(\*\/\d+)))$/,
    };

    return regexMap[type]?.test(value) ?? false;
};