export const deduplicateArrayByProperty = <T>(array: T[], property: keyof T) => {
    const uniqueValues = new Set();
    const deduplicatedArray = array.filter((item) => {
        if (uniqueValues.has(item[property])) {
            return false;
        }
        uniqueValues.add(item[property]);
        return true;
    });

    return deduplicatedArray;
}