export const createShadesMode = ({
  initShadeSetup,
  updateShadesPosition,
} = {}) => {
  return {
    name: "shades",
    init: (shared) => {
      initShadeSetup?.();
      updateShadesPosition?.(null, shared);
    },
    update(event, shared) {
      updateShadesPosition?.(event, shared);
    },
    teardown() {
      document.getElementsByClassName("top-shade")[0]?.remove();
      document.getElementsByClassName("bottom-shade")[0]?.remove();

      const hasAnyOverlays =
        document.querySelector(".top-shade") ||
        document.querySelector(".bottom-shade") ||
        document.querySelector(".spotlight-overlay");

      if (!hasAnyOverlays && document.body.getAttribute("id") === "body") {
        document.body.removeAttribute("id");
      }
    },
    onOffsetChange(shared) {
      updateShadesPosition?.(null, shared);
    },
  };
};
