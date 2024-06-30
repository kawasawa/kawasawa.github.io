export const extractAlt = (source: string) => source.match(/^.*\/-(.+)-.*$/)?.[1] ?? source;
