chrome.commands.onCommand.addListener((command) => {
  if (command === "close") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "closeShades" });
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "openShades" });
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["main.js"],
      });
    });
  }
});
