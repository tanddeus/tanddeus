export function useScreenDimensions() {
  const screenDimensions = reactive({
    width: 0,
    height: 0,
  });

  function updateScreenDimensions() {
    screenDimensions.width = window.innerWidth;
    screenDimensions.height = window.innerHeight;
  }

  onBeforeMount(() => {
    updateScreenDimensions();

    window.addEventListener('resize', updateScreenDimensions);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenDimensions);
  });

  return screenDimensions;
}
