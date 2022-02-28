export type GoogleSheetsApiResponse = {
  range: string;
  majorDimension: string;
  values: string[][];
};

/** @deprecated 破棄予定 */
export type FaviconGrabberApiResponse = {
  domain: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
  }[];
};
