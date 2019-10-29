/**[)*/
export const randomInt = (min, max) => {
    const _min = min | 0;
    const _max = max | 0 - _min;
    return (_min + Math.random() * _max) | 0;
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
