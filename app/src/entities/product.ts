import { sources } from '@/assets';
import imageProduct__hiyori__01 from '@/assets/products__hiyori--01.webp';
import imageProduct__hiyori__02 from '@/assets/products__hiyori--02.webp';
import imageProduct__MyPad__01 from '@/assets/products__MyPad--01.webp';
import imageProduct__MyPad__02 from '@/assets/products__MyPad--02.webp';
import imageProduct__toolbox__01 from '@/assets/products__toolbox--01.webp';
import imageProduct__toolbox__02 from '@/assets/products__toolbox--02.webp';

export type Product = Readonly<{
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
    id: 'mypad',
    summary: 'Modern Text Editor',
    code: 'https://github.com/kawasawa/MyPad',
    page: 'https://apps.microsoft.com/store/detail/9PP2600ZM2JD',
    images: [imageProduct__MyPad__01, imageProduct__MyPad__02],
    tags: [sources.csharp, sources.dotnet, sources.wpf, sources.prism, sources.mahapps, sources.win32, sources.wap],
    downloads: 4000,
  },
  {
    id: 'hiyori',
    summary: 'Weather Forecast',
    code: 'https://github.com/kawasawa/hiyori',
    page: 'https://kawasawa.github.io/hiyori',
    images: [imageProduct__hiyori__01, imageProduct__hiyori__02],
    tags: [sources.typescript, sources.reactjs, sources.mui, sources.pwa, sources.leaflet],
  },
  {
    id: 'toolbox',
    summary: 'Development Toolkit',
    code: 'https://github.com/kawasawa/go-wasm-toys',
    page: 'https://kawasawa.github.io/go-wasm-toys/',
    images: [imageProduct__toolbox__01, imageProduct__toolbox__02],
    tags: [sources.go, sources.wasm, sources.javascript],
  },
  {
    id: 'koyomi',
    summary: 'Japanese Calendar',
    code: 'https://github.com/kawasawa/koyomi',
    page: 'https://kawasawa.github.io/koyomi',
    images: [],
    tags: [sources.typescript, sources.reactjs, sources.mui, sources.pwa],
  },
  {
    id: 'mybase',
    summary: 'Development Library',
    code: 'https://github.com/kawasawa/MyBase',
    page: 'https://www.nuget.org/packages/MyBase/',
    images: [],
    tags: [sources.csharp, sources.dotnetcore, sources.prism, sources.nuget],
    downloads: 1400,
  },
];
