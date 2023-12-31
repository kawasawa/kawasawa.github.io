import React from 'react';

import { endpoints } from '@/constants';
import { createInstance, GoogleSheetsApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

export type ProductImageData = {
  rowNo: number;
  data: string;
};

export type ProductData = {
  id: number;
  'title_ja-JP': string;
  'title_en-US': string;
  'subject_ja-JP': string;
  'subject_en-US': string;
  'body_ja-JP': string;
  'body_en-US': string;
  skills: { key: string; icon: string }[];
  url_code: string;
  url_home: string;
  downloads: number | null;
  pickup: boolean;
  visible: boolean;
  images: ProductImageData[];
};

const fetchData = async () => {
  const client = createInstance();
  const [productsResponse, productImagesResponse, iconsResponse] = await Promise.all([
    client.get<GoogleSheetsApiResponse>(endpoints.getProducts),
    client.get<GoogleSheetsApiResponse>(endpoints.getProductImages),
    client.get<GoogleSheetsApiResponse>(endpoints.getIcons),
  ]);

  const product = productsResponse.data.values[0];
  const product_id = product.indexOf('id');
  const product_titleJaJp = product.indexOf('title_ja-JP');
  const product_titleEnUs = product.indexOf('title_en-US');
  const product_subjectJaJp = product.indexOf('subject_ja-JP');
  const product_subjectEnUs = product.indexOf('subject_en-US');
  const product_bodyJaJp = product.indexOf('body_ja-JP');
  const product_bodyEnUs = product.indexOf('body_en-US');
  const product_skills = product.indexOf('skills');
  const product_urlCode = product.indexOf('url_code');
  const product_urlHome = product.indexOf('url_home');
  const product_downloads = product.indexOf('downloads');
  const product_pickup = product.indexOf('pickup');
  const product_visible = product.indexOf('visible');

  const productImage = productImagesResponse.data.values[0];
  const productImage_productId = productImage.indexOf('product_id');
  const productImage_rowNo = productImage.indexOf('row_no');
  const productImage_data = productImage.indexOf('data');

  const icon = iconsResponse.data.values[0];
  const icon_id = icon.indexOf('id');
  const icon_data = icon.indexOf('data');

  const buffer = productsResponse.data.values.slice(1, productsResponse.data.values.length).map(
    (row) =>
      ({
        id: Number(row[product_id]),
        'title_ja-JP': row[product_titleJaJp],
        'title_en-US': row[product_titleEnUs],
        'subject_ja-JP': row[product_subjectJaJp],
        'subject_en-US': row[product_subjectEnUs],
        'body_ja-JP': row[product_bodyJaJp],
        'body_en-US': row[product_bodyEnUs],
        skills: row[product_skills]
          .split(',')
          .map((s) => s.trim())
          .map((s) => {
            const icon = iconsResponse.data.values.find((row) => row[icon_id] === s);
            return { key: s, icon: icon ? icon[icon_data] : '' };
          }),
        url_code: row[product_urlCode],
        url_home: row[product_urlHome],
        downloads: row[product_downloads] ? Number(row[product_downloads]) : null,
        pickup: row[product_pickup]?.toLowerCase() === 'true' ? true : false,
        visible: row[product_visible]?.toLowerCase() === 'true' ? true : false,
        images: [],
      } as ProductData)
  );

  productImagesResponse.data.values.slice(1, productImagesResponse.data.values.length).forEach((row) => {
    const productId = Number(row[productImage_productId]);
    const product = buffer.find((c) => c.id === productId);
    if (!product) return;

    product.images[product.images.length] = {
      rowNo: Number(row[productImage_rowNo]),
      data: row[productImage_data],
    };
  });

  return buffer;
};

export const useProducts = (ready: boolean) => {
  const [cache, setCache] = React.useState<ProductData[]>();

  React.useEffect(() => {
    if (ready && !cache)
      (async () => {
        try {
          const data = await fetchData();
          setCache(data);
        } catch (e) {
          handleError(e);
        }
      })();
  }, [ready, cache]);

  return cache;
};
