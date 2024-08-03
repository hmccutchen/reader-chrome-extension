const isValidUrl = (url) => {
  if (
    url &&
    !url.includes("chrome://") &&
    !url.includes("chrome-extension://")
  ) {
    alert("This is not a valid URL");
  }
};

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    isValidUrl(tabs[0].url);
    switch (command) {
      case "close":
        chrome.tabs.sendMessage(tabId, { action: "closeShades" });
        break;

      case "open":
        chrome.tabs.sendMessage(tabId, { action: "openShades" });
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["main.js"],
        });
        break;

      case "increase":
        chrome.tabs.sendMessage(tabId, { action: "increase" });
        break;

      case "decrease":
        chrome.tabs.sendMessage(tabId, { action: "decrease" });
        break;
      default:
        console.warn(`Unknown command: ${command}`);
    }
  });
});
