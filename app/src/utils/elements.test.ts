import { scrollToElement, scrollToTop } from './elements';

describe('elements', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  describe('scrollToTop', () => {
    test('ページ最上部にスクロールすること', () => {
      scrollToTop();

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('scrollToElement', () => {
    test('指定された要素にスクロールすること', () => {
      const mockElement = document.createElement('div');
      mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 } as DOMRect);
      document.getElementById = jest.fn().mockReturnValue(mockElement);
      Object.defineProperty(window, 'scrollY', { value: 50 });

      scrollToElement('test-element', 10);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 160, // top(100) + scrollY(50) + offset(10)
        behavior: 'smooth',
      });
    });

    test('要素が存在しない場合、スクロールしないこと', () => {
      document.getElementById = jest.fn().mockReturnValue(null);
      scrollToElement('non-existent-element');

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
