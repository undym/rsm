

/**[)*/
export const randomInt = (min:number, max:number):number=>{
    const _min = min|0;
    const _max = max|0 - _min;
    return (_min + Math.random() * _max)|0;
};

export const randomFloat = (min:number, max:number):number=>{
    return min + Math.random() * (max - min);
};

// export function choice<T>(arr:ReadonlyArray<T>):T;
// export function choice<T>(arr:Array<T>):T;
// export function choice<T>(arr:any):T;
//     let i = Math.floor( Math.random() * arr.length );
//     return arr[i];
// };

export const choice = <T>(arr:ReadonlyArray<T> | Array<T>):T=>{
    let i = Math.floor( Math.random() * arr.length );
    return arr[i];
}