import { nanoid } from 'nanoid';

const scrollableElementId = nanoid();

/**
 * Calculates the current width of the scrollbar in pixels.
 *
 * @returns The width of the scrollbar in pixels.
 */
export function calculateScrollbarWidth(): number {
  const scrollableElement = getOrCreateHiddenScrollableElement();

  const scrollbarWidth =
    scrollableElement.offsetWidth - scrollableElement.clientWidth;

  return scrollbarWidth;
}

/**
 * Attempts to find a hidden scrollable element on the page. If no such element
 * exists, it is created.
 *
 * @returns A hidden element with a vertical scrollbar.
 */
function getOrCreateHiddenScrollableElement(): HTMLElement {
  const scrollableElement = document.getElementById(scrollableElementId);
  return scrollableElement ?? createHiddenScrollableElement();
}

/**
 * Creates a hidden element with a vertical scrollbar.
 *
 * @returns The element that was created.
 */
function createHiddenScrollableElement(): HTMLElement {
  const scrollableElement = document.createElement('div');
  const scrollableElementSize = '100px';

  scrollableElement.id = scrollableElementId;
  scrollableElement.style.position = 'absolute';
  scrollableElement.style.top = `-${scrollableElementSize}`;
  scrollableElement.style.display = 'block';
  scrollableElement.style.width = scrollableElementSize;
  scrollableElement.style.height = scrollableElementSize;
  scrollableElement.style.overflowY = 'scroll';

  document.body.appendChild(scrollableElement);

  return scrollableElement;
}
