/**
 * Determines if the content of the page is vertically scrollable.
 *
 * @returns `true` if the content of the page is vertically scrollable.
 */
export function getIsPageScrollable() {
  const html = document.getElementsByTagName('html')[0]!;
  return html.scrollHeight > html.clientHeight;
}
