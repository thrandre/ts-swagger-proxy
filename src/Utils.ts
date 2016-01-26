export function groupBy<T>(arr: T[], keySelector?: (e: T) => string): { [key: string]: T[] } {
    keySelector = keySelector || (e => e.toString());

    return arr.reduce<{ [key: string]: T[] }>(
        (p, n) => {
            let key = keySelector(n);
            let arrOfArr = p[key] || (p[key] = []);

            arrOfArr.push(n);

            return p;
        },
        {}
    );
}

export function unique<T>(arr: T[], keySelector?: (e: T) => string): T[] {
    keySelector = keySelector || (e => e.toString());
    const groups = groupBy(arr, keySelector);
    return Object.keys(groups).map(k => groups[k][0]);
}

export function mapMany<T, TOut>(arr: T[], selector: (source: T) => TOut[]): TOut[] {
    return arr.map(selector).reduce((prev, next) => prev.concat(next), []);
}

export function resolveJsonRef(root: any, ref: string): [string, any] {
    const allPathSegments = ref.split("/");
    const pathSegments = allPathSegments[0] === "#" ?
        allPathSegments.slice(1) :
        allPathSegments;

    return [pathSegments[pathSegments.length - 1], pathSegments.reduce((prev, next) => prev[next], root)];
}
