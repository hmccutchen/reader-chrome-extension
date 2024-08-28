chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;

    switch (command) {
      case "close":
        chrome.tabs.sendMessage(tabId, { action: "closeShades" });

        break;

      case "open":
        console.log("Opening shades");
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["main.js"],
        });

        chrome.tabs.sendMessage(tabId, { action: "openShades" });

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
