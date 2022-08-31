import { sources } from '../assets';
import imageProduct__hiyori__01 from '../assets/products__hiyori--01.webp';
import imageProduct__hiyori__02 from '../assets/products__hiyori--02.webp';
import imageProduct__koyomi__01 from '../assets/products__koyomi--01.webp';
import imageProduct__koyomi__02 from '../assets/products__koyomi--02.webp';
import imageProduct__MyPad__01 from '../assets/products__MyPad--01.webp';
import imageProduct__MyPad__02 from '../assets/products__MyPad--02.webp';

type Product = Readonly<{
  id: string;
  summary: string;
  code: string;
  page: string;
  images: string[];
  tags: string[];
  downloads?: number;
}>;

export const products: Product[] = [
  {
    id: 'MyPad',
    summary: 'Modern Text Editor',
    code: 'https://github.com/kawasawa/MyPad',
    page: 'https://www.microsoft.com/store/apps/9pp2600zm2jd',
    images: [imageProduct__MyPad__01, imageProduct__MyPad__02],
    tags: [sources.csharp, sources.dotnet6, sources.wpf, sources.prism, sources.mahapps],
    downloads: 3000,
  },
  {
    id: 'hiyori',
    summary: 'Weather Forecast',
    code: 'https://github.com/kawasawa/hiyori',
    page: 'https://kawasawa.github.io/hiyori',
    images: [imageProduct__hiyori__01, imageProduct__hiyori__02],
    tags: [sources.typescript, sources.react, sources.mui, sources.leaflet],
  },
  {
    id: 'koyomi',
    summary: 'Japanese Calendar',
    code: 'https://github.com/kawasawa/koyomi',
    page: 'https://kawasawa.github.io/koyomi',
    images: [imageProduct__koyomi__01, imageProduct__koyomi__02],
    tags: [sources.typescript, sources.react, sources.mui4],
  },
];
