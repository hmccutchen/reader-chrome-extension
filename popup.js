

document.addEventListener('DOMContentLoaded', function () {
    let button = document.getElementById("activate-reader");
    button.onclick = injectScript;
});

async function injectScript() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab)
    await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
    })
    window.close()
}


document.addEventListener('DOMContentLoaded', function () {
    let offButton = document.getElementById("deactivate-reader");
    offButton.onclick = newScript;
});

async function newScript() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab)
    await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['random.js']
    })
    window.close()
}

