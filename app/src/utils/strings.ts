export const stringFormat = (str: string, ...args: string[]) => {
  let result = str;
  for (let i = 0; i < args.length; i++) result = result.replace(`{${i}}`, args[i]);
  return result;
};
