document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const messageElement = document.getElementById('message');
  const tabContainer = document.getElementById('tab-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabUrl = tabs[0].url;

    if (currentTabUrl.includes('vietnix.vn')) {
      messageElement.style.display = 'none';
      tabContainer.style.display = 'block';

      chrome.tabs.sendMessage(tabs[0].id, { action: 'getContentOverview' }, (overviewResponse) => {
        if (overviewResponse) {
          displayOverview(overviewResponse);
        }
      });

      chrome.tabs.sendMessage(tabs[0].id, { action: 'getImagesAndLinks' }, (response) => {
        if (response) {
          displayData(response.images, response.links, response.overview);
        }
      });
    } else {
      messageElement.style.display = 'block';
      tabContainer.style.display = 'none';
    }
  });
});

function displayOverview(data) {
  document.getElementById('meta-title').textContent = data.metaTitle;
  document.getElementById('meta-description').textContent = data.metaDescription;
  const thumbnail = document.getElementById('thumbnail');
  thumbnail.src = data.thumbnail;
  thumbnail.alt = data.thumbnailAlt;
  document.getElementById('thumbnail-alt').textContent = data.thumbnailAlt;
  document.getElementById('word-count').textContent = data.wordCount;
}

function displayData(images, links, overview) {
  // Overview tab counts
  document.getElementById('total-images').textContent = overview.totalImages;
  document.getElementById('total-images-with-alt').textContent = overview.totalImagesWithAlt;
  document.getElementById('total-images-without-alt').textContent = overview.totalImagesWithoutAlt;
  document.getElementById('missing-title').textContent = overview.totalImagesWithoutTitle;
  document.getElementById('missing-caption').textContent = overview.totalImagesWithoutCaption;

  document.getElementById('total-urls').textContent = overview.totalUrls;
  document.getElementById('total-duplicated-urls').textContent = overview.totalDuplicatedUrls;
  document.getElementById('total-new-tab-urls').textContent = overview.totalNewTabUrls;
  document.getElementById('total-internal-links').textContent = overview.totalInternalLinks;
  document.getElementById('total-external-links').textContent = overview.totalExternalLinks;
  document.getElementById('total-no-follow-urls').textContent = overview.totalNoFollowUrls;

  // Links tab counts
  document.getElementById('link-total-urls').textContent = overview.totalUrls;
  document.getElementById('link-total-duplicated-urls').textContent = overview.totalDuplicatedUrls;
  document.getElementById('link-total-new-tab-urls').textContent = overview.totalNewTabUrls;
  document.getElementById('link-total-internal-links').textContent = overview.totalInternalLinks;
  document.getElementById('link-total-external-links').textContent = overview.totalExternalLinks;
  document.getElementById('link-total-no-follow-urls').textContent = overview.totalNoFollowUrls;

  const imagesTable = document.getElementById('images-table').getElementsByTagName('tbody')[0];
  const linksTable = document.getElementById('links-table').getElementsByTagName('tbody')[0];

  imagesTable.innerHTML = '';
  linksTable.innerHTML = '';

  images.forEach(image => {
    const row = imagesTable.insertRow();
    row.insertCell(0).textContent = image.id;
    row.insertCell(1).textContent = image.alt_text;
    const urlCell = row.insertCell(2);
    const urlLink = document.createElement('a');
    urlLink.href = image.url;
    urlLink.target = '_blank';
    urlLink.textContent = image.url;
    urlCell.appendChild(urlLink);
    row.insertCell(3).textContent = image.name;
    row.insertCell(4).textContent = image.format;
    row.insertCell(5).textContent = image.caption;
  });

  links.forEach(link => {
    const row = linksTable.insertRow();
    const numberCell = row.insertCell(0);
    const anchorCell = row.insertCell(1);
    const urlCell = row.insertCell(2);

    numberCell.textContent = link.link_id;
    anchorCell.textContent = link.anchor;
    const urlLink = document.createElement('a');
    urlLink.href = link.url;
    urlLink.target = '_blank';
    urlLink.textContent = link.url;
    urlCell.appendChild(urlLink);

    if (link.is_duplicated) {
      urlCell.style.backgroundColor = '#FFFF00'; // Yellow
    }
    if (link.is_external) {
      numberCell.style.backgroundColor = '#D9EAD3'; // Green
    }
    if (link.is_new_tab) {
      anchorCell.style.backgroundColor = '#F4CCCC'; // Red
    }
  });

  const imageFormatsList = document.getElementById('image-formats-list');
  imageFormatsList.innerHTML = '';

  for (const [format, count] of Object.entries(overview.imageFormatsCount)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${format}: ${count}`;
    imageFormatsList.appendChild(listItem);
  }
}
