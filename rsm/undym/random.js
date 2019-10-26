export const randomInt = (min, max) => {
    min = Math.round(min);
    max = Math.round(max - min);
    return (min + Math.random() * max) | 0;
};
export const randomFloat = (min, max) => {
    return min + Math.random() * (max - min);
};
// export function choice<T>(arr:ReadonlyArray<T>):T;
// export function choice<T>(arr:Array<T>):T;
// export function choice<T>(arr:any):T;
//     let i = Math.floor( Math.random() * arr.length );
//     return arr[i];
// };
export const choice = (arr) => {
    let i = Math.floor(Math.random() * arr.length);
    return arr[i];
};
