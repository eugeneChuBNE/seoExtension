chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getImagesAndLinks
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const data = results[0].result;
        // Send data to the backend if needed
        // Example: fetch('http://your-backend-url/images/', { method: 'POST', body: JSON.stringify(data.images) })
      }
    });
  });
  