chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;

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

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.scripting.executeScript({
//     target: { tabId: activeInfo.tabId },
//     files: ["main.js"],
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete") {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ["main.js"],
//     });
//   }
// });
