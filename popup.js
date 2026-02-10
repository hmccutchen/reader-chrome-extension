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

const setToolbarState = (isOn) => {
  toggleButton.textContent = isOn ? "ON" : "OFF";
  toggleButton.classList.toggle("is-on", isOn);
  toggleButton.setAttribute("aria-pressed", String(isOn));
  indicator.classList.toggle("is-on", isOn);
  statusText.textContent = isOn ? "Toolbar on" : "Toolbar off";
  visibilityButton.disabled = !isOn;
};

const requestToolbarState = () => {
  sendActionToActiveTab("toolbarState", (response) => {
    if (!response) return;
    if (typeof response.toolbarVisible === "boolean") {
      setToolbarState(response.toolbarVisible);
    }
    if (typeof response.toolbarHidden === "boolean") {
      visibilityButton.textContent = response.toolbarHidden ? "Show" : "Hide";
    }
  });
};

toggleButton.addEventListener("click", () => {
  sendActionToActiveTab("toggleToolbar");
  setTimeout(requestToolbarState, 50);
});

visibilityButton.addEventListener("click", () => {
  sendActionToActiveTab("toggleToolbarVisibility");
  setTimeout(requestToolbarState, 50);
});

requestToolbarState();
