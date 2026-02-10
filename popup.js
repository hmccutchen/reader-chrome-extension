document.getElementById("activate-spotlight").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["main.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError);
          return;
        }
        chrome.tabs.sendMessage(tabId, { action: "spotlight" });
      }
    );
  });
});
