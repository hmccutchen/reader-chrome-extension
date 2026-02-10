export const createSpotlightMode = ({
  initSpotlightSetup,
  updateSpotlightPosition,
} = {}) => {
  return {
    name: "spotlight",
    init: (shared) => {
      initSpotlightSetup?.();
      updateSpotlightPosition?.(null, shared);
    },
    update(event, shared) {
      updateSpotlightPosition?.(event, shared);
    },
    teardown() {
      document.querySelector(".spotlight-overlay")?.remove();

      const hasAnyOverlays =
        document.querySelector(".top-shade") ||
        document.querySelector(".bottom-shade") ||
        document.querySelector(".spotlight-overlay");

      if (!hasAnyOverlays && document.body.getAttribute("id") === "body") {
        document.body.removeAttribute("id");
      }
    },
    onOffsetChange(shared) {
      updateSpotlightPosition?.(null, shared);
    },
  };
};
