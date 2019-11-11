/**[)*/
export const randomInt = (min, max, boundaries = "[)") => {
    if (boundaries.length < 2 || boundaries.length > 2) {
        console.log(`randomInt() illiegal boundaries: ${boundaries}`);
        boundaries = "[)";
    }
    let _min = min | 0;
    if (boundaries.substring(0, 1) === "(") {
        _min++;
    }
    let _max = (max | 0) - _min;
    if (boundaries.substring(1, 2) === "]") {
        _max++;
    }
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
