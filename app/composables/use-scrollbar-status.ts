import { calculateScrollbarWidth, getIsPageScrollable } from '~/shared';

const scrollbarStatus = reactive({
  scrollbarWidth: 0,
  isPageScrollable: false,
});

const interval = ref<ReturnType<typeof setInterval>>();

/**
 * Returns a reactive object whose properties include the current width of the
 * scrollbar (regardless of whether the page is scrollable or not) and a boolean
 * value indicating whether or not the page is vertically scrollable.
 */
export function useScrollbarStatus() {
  onBeforeMount(() => {
    const initializationComplete = !!interval.value;
    if (initializationComplete) {
      return;
    }

    scrollbarStatus.scrollbarWidth = calculateScrollbarWidth();
    scrollbarStatus.isPageScrollable = getIsPageScrollable();

    interval.value = setInterval(() => {
      scrollbarStatus.scrollbarWidth = calculateScrollbarWidth();
      scrollbarStatus.isPageScrollable = getIsPageScrollable();
    }, 10);
  });

  return scrollbarStatus;
}
