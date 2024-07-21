chrome.commands.onCommand.addListener((command) => {
  console.log("Command:", command);
  if (command === "close") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "closeShades" });
    });
  }
});
