export const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const arrayToObject = (
    arr,
    key = '_id',
    mapFunction = (obj) => obj,
) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arr.reduce((accumulator, obj) => {
        if (obj[key]) {
            return {
                ...accumulator,
                [obj[key]]: mapFunction(obj, accumulator[obj[key]]),
            };
        }
        return accumulator;
    }, {});
