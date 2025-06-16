chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension SEAO installée.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "launchSearch") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
  }
});
