const shouldInjectContentScript = (error) => {
  const message = error?.message || "";
  return (
    message.includes("Could not establish connection") ||
    message.includes("Receiving end does not exist")
  );
};

const sendActionToTab = (tabId, action) => {
  chrome.tabs.sendMessage(tabId, { action }, () => {
    const error = chrome.runtime.lastError;
    if (!error) {
      return;
    }
    if (!shouldInjectContentScript(error)) return;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["main.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          return;
        }
        chrome.tabs.sendMessage(tabId, { action });
      },
    );
  });
};

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.warn("No active tab found.");
      return;
    }

    const tabId = tabs[0].id;
    if (typeof tabId !== "number") {
      return;
    }

    switch (command) {
      case "close":
        sendActionToTab(tabId, "closeShades");
        break;
      case "open":
        sendActionToTab(tabId, "openShades");
        break;
      case "increase":
        sendActionToTab(tabId, "increase");
        break;
      case "decrease":
        sendActionToTab(tabId, "decrease");
        break;
      default:
        console.warn(`Unknown command: ${command}`);
    }
  });
});
