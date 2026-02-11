const sendActionToActiveTab = (action, callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action }, (response) => {
      if (chrome.runtime.lastError) {
        return;
      }
      callback?.(response);
    });
  });
};

const toggleButton = document.getElementById("toggle-toolbar");
const indicator = document.getElementById("toolbar-indicator");
const statusText = document.getElementById("toolbar-status");
const visibilityButton = document.getElementById("toggle-toolbar-visibility");

const setToolbarState = (isOn, isLocked) => {
  toggleButton.textContent = isOn ? "ON" : "OFF";
  toggleButton.classList.toggle("is-on", isOn);
  toggleButton.setAttribute("aria-pressed", String(isOn));
  toggleButton.disabled = Boolean(isLocked);
  indicator.classList.toggle("is-on", isOn);
  statusText.textContent = isOn ? "Toolbar on" : "Toolbar off";
  visibilityButton.disabled = !isOn;
};

const requestToolbarState = () => {
  sendActionToActiveTab("toolbarState", (response) => {
    if (!response) return;
    const isHidden = response.toolbarHidden === true;
    if (typeof response.toolbarVisible === "boolean") {
      const isOn = response.toolbarVisible;
      const lockOff = isOn && isHidden;
      setToolbarState(isOn, lockOff);
      const lockMessage = lockOff
        ? "Toolbar hidden. Show it to turn off."
        : "";
      statusText.title = lockMessage;
      toggleButton.title = lockMessage;
      if (lockOff) {
        statusText.textContent = "Toolbar hidden";
      }
    }
    if (typeof response.toolbarHidden === "boolean") {
      visibilityButton.textContent = isHidden ? "Show" : "Hide";
    }
  });
};

toggleButton.addEventListener("click", () => {
  if (toggleButton.disabled) return;
  sendActionToActiveTab("toggleToolbar");
  setTimeout(requestToolbarState, 50);
});

visibilityButton.addEventListener("click", () => {
  sendActionToActiveTab("toggleToolbarVisibility");
  setTimeout(requestToolbarState, 50);
});

requestToolbarState();
