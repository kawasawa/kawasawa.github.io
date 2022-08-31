export type GoogleSheetsApiResponse = {
  range: string;
  majorDimension: string;
  values: string[][];
};

export type FaviconGrabberApiResponse = {
  domain: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
  }[];
};
