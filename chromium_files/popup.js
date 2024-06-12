document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const messageElement = document.getElementById('message');
  const tabContainer = document.getElementById('tab-container');
  const toggleImageViewButton = document.getElementById('toggle-image-view');
  const imageViewContainer = document.getElementById('image-view-container');

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

      let action;
      if (currentTabUrl.includes('wp-admin/post-new.php')) {
        action = 'getContentOverviewFromCreate';
      } else if (currentTabUrl.includes('wp-admin/post.php') && currentTabUrl.includes('&action=edit')) {
        action = 'getContentOverviewFromEdit';
      } else {
        action = 'getContentOverview';
      }

      chrome.tabs.sendMessage(tabs[0].id, { action }, (overviewResponse) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        if (overviewResponse && !overviewResponse.error) {
          displayOverview(overviewResponse);
        } else {
          console.error('Error in content overview response:', overviewResponse ? overviewResponse.error : 'No response');
        }
      });

      chrome.tabs.sendMessage(tabs[0].id, { action: 'getImagesAndLinks' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        if (response && !response.error) {
          displayData(response.images, response.links, response.overview);
        } else {
          console.error('Error in images and links response:', response ? response.error : 'No response');
        }
      });
    } else {
      messageElement.style.display = 'block';
      tabContainer.style.display = 'none';
    }
  });

  document.getElementById('grid-select').addEventListener('change', function() {
    updateGridLayout(this.value);
  });

  toggleImageViewButton.addEventListener('click', () => {
    if (imageViewContainer.style.display === 'none') {
      imageViewContainer.style.display = 'block';
      toggleImageViewButton.textContent = 'Collapse';
    } else {
      imageViewContainer.style.display = 'none';
      toggleImageViewButton.textContent = 'Expand';
    }
  });

  // Set default grid layout to 4 columns
  document.getElementById('grid-select').value = '4';
  updateGridLayout('4');
});

function displayOverview(data) {
  document.getElementById('meta-title').textContent = data.metaTitle || '';
  document.getElementById('meta-description').textContent = data.metaDescription || '';
  const thumbnail = document.getElementById('thumbnail');
  thumbnail.src = data.thumbnail || '';
  thumbnail.alt = data.thumbnailAlt || '';
  document.getElementById('thumbnail-alt').textContent = data.thumbnailAlt || '';
  document.getElementById('word-count').textContent = data.wordCount || 0;
}

function displayData(images = [], links = [], overview = {}) {
  // Ensure default values if data is undefined
  const {
    totalImages = 0,
    totalImagesWithAlt = 0,
    totalImagesWithoutAlt = 0,
    totalImagesWithoutTitle = 0,
    totalImagesWithoutCaption = 0,
    totalUrls = 0,
    totalDuplicatedUrls = 0,
    totalNewTabUrls = 0,
    totalInternalLinks = 0,
    totalExternalLinks = 0,
    totalNoFollowUrls = 0,
    imageFormatsCount = {}
  } = overview;

  // Overview tab counts
  document.getElementById('total-images').textContent = totalImages;
  document.getElementById('total-images-with-alt').textContent = totalImagesWithAlt;
  document.getElementById('total-images-without-alt').textContent = totalImagesWithoutAlt;
  document.getElementById('missing-title').textContent = totalImagesWithoutTitle;
  document.getElementById('missing-caption').textContent = totalImagesWithoutCaption;

  document.getElementById('total-urls').textContent = totalUrls;
  document.getElementById('total-duplicated-urls').textContent = totalDuplicatedUrls;
  document.getElementById('total-new-tab-urls').textContent = totalNewTabUrls;
  document.getElementById('total-internal-links').textContent = totalInternalLinks;
  document.getElementById('total-external-links').textContent = totalExternalLinks;
  document.getElementById('total-no-follow-urls').textContent = totalNoFollowUrls;

  // Links tab counts
  document.getElementById('link-total-urls').textContent = totalUrls;
  document.getElementById('link-total-duplicated-urls').textContent = totalDuplicatedUrls;
  document.getElementById('link-total-new-tab-urls').textContent = totalNewTabUrls;
  document.getElementById('link-total-internal-links').textContent = totalInternalLinks;
  document.getElementById('link-total-external-links').textContent = totalExternalLinks;
  document.getElementById('link-total-no-follow-urls').textContent = totalNoFollowUrls;

  // Images tab counts
  document.getElementById('total-images-overview').textContent = totalImages;
  document.getElementById('total-missing-title-overview').textContent = totalImagesWithoutTitle;
  document.getElementById('total-missing-alt-overview').textContent = totalImagesWithoutAlt;
  document.getElementById('total-missing-caption-overview').textContent = totalImagesWithoutCaption;

  const imagesTable = document.getElementById('images-table').getElementsByTagName('tbody')[0];
  const linksTable = document.getElementById('links-table').getElementsByTagName('tbody')[0];
  const imageView = document.getElementById('image-view');

  imagesTable.innerHTML = '';
  linksTable.innerHTML = '';
  imageView.innerHTML = '';

  images.forEach(image => {
    const row = imagesTable.insertRow();
    const numberCell = row.insertCell(0);
    const altCell = row.insertCell(1);
    const captionCell = row.insertCell(2);
    const imageCell = row.insertCell(3);
    const formatCell = row.insertCell(4);

    numberCell.textContent = image.id;
    altCell.textContent = image.alt_text;
    captionCell.textContent = image.caption;
    formatCell.textContent = image.format;

    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.alt_text;
    img.classList.add('thumbnail');
    imageCell.appendChild(img);
    const fileNameLink = document.createElement('a');
    fileNameLink.href = image.url;
    fileNameLink.target = '_blank';
    fileNameLink.textContent = image.name;
    imageCell.appendChild(fileNameLink);

    row.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToImage', imageUrl: image.url });
      });
    });

    const imgElement = document.createElement('div');
    imgElement.classList.add('image-container');
    const imgTag = document.createElement('img');
    imgTag.src = image.url;
    imgTag.alt = image.alt_text;
    imgTag.classList.add('thumbnail');
    const imgInfo = document.createElement('div');
    imgInfo.classList.add('image-info');
    imgInfo.textContent = `${image.id}. ${image.name}`;
    imgElement.appendChild(imgTag);
    imgElement.appendChild(imgInfo);
    imgElement.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToImage', imageUrl: image.url });
      });
    });
    imageView.appendChild(imgElement);
  });

  links.forEach(link => {
    const row = linksTable.insertRow();
    const numberCell = row.insertCell(0);
    const anchorCell = row.insertCell(1);
    const urlCell = row.insertCell(2);

    numberCell.textContent = link.link_id;
    anchorCell.textContent = link.anchor;
    anchorCell.style.cursor = 'pointer'; // Make anchor cell look clickable

    if (link.is_duplicated) {
      const findNextButton = document.createElement('button');
      findNextButton.textContent = 'Find next';
      findNextButton.style.marginLeft = '10px';
      findNextButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'findNextDuplicate', anchorText: link.anchor });
        });
      });
      anchorCell.appendChild(findNextButton);
    }

    anchorCell.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToAnchor', anchorText: link.anchor });
      });
    });

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

  for (const [format, count] of Object.entries(imageFormatsCount)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${format}: ${count}`;
    imageFormatsList.appendChild(listItem);
  }

  // Display images in the image grid
  updateGridLayout(document.getElementById('grid-select').value);
}

function updateGridLayout(columns) {
  const imageView = document.getElementById('image-view');
  imageView.className = 'image-grid'; // Reset class name to base
  imageView.classList.add(`grid-${columns}`);
}
