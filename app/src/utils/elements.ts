/**
 * 画面の最上部にスムーススクロールします。
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * 指定された要素へスムーススクロールします。
 * @param elementId スクロール先の要素の ID
 * @param offset スクロール位置に加算するオフセット値 (デフォルト: 0)
 */
export const scrollToElement = (elementId: string, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition + offset,
      behavior: 'smooth',
    });
  }
};
