document.getElementById('analyze').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getImagesAndLinks' }, (response) => {
        if (response) {
          displayData(response.images, response.links);
        }
      });
    });
  });
  
  function displayData(images, links) {
    const imagesTable = document.getElementById('images-table').getElementsByTagName('tbody')[0];
    const linksTable = document.getElementById('links-table').getElementsByTagName('tbody')[0];
  
    imagesTable.innerHTML = '';
    linksTable.innerHTML = '';
  
    images.forEach(image => {
      const row = imagesTable.insertRow();
      row.insertCell(0).textContent = image.id;
      row.insertCell(1).textContent = image.alt_text;
      row.insertCell(2).textContent = image.url;
      row.insertCell(3).textContent = image.name;
      row.insertCell(4).textContent = image.format;
      row.insertCell(5).textContent = image.caption;
    });
  
    links.forEach(link => {
      const row = linksTable.insertRow();
      row.insertCell(0).textContent = link.link_id;
      row.insertCell(1).textContent = link.anchor;
      row.insertCell(2).textContent = link.url;
      row.insertCell(3).textContent = link.is_external;
      row.insertCell(4).textContent = link.is_nofollow;
      row.insertCell(5).textContent = link.is_new_tab;
    });
  }
  