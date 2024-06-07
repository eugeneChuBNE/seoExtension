function getContentOverview() {
  const metaTitle = document.querySelector('title') ? document.querySelector('title').innerText : '';
  const metaDescription = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : '';
  const thumbnail = document.querySelector('meta[property="og:image"]') ? document.querySelector('meta[property="og:image"]').getAttribute('content') : '';
  const thumbnailAlt = document.querySelector(`img[src="${thumbnail}"]`) ? document.querySelector(`img[src="${thumbnail}"]`).alt : '';
  const wordCount = document.querySelector('#vnx_post_content') ? document.querySelector('#vnx_post_content').innerText.split(/\s+/).length : 0;

  return {
    metaTitle,
    metaDescription,
    thumbnail,
    thumbnailAlt,
    wordCount
  };
}

function getImagesAndLinks() {
  const contentArea = document.querySelector('#vnx_post_content');
  if (!contentArea) {
    return { images: [], links: [] };
  }

  let imageIdCounter = 1;
  let linkIdCounter = 1;

  const imageFormatsCount = {};
  let totalImagesWithAlt = 0;
  let totalImagesWithoutAlt = 0;
  let totalImagesWithTitle = 0;
  let totalImagesWithoutTitle = 0;
  let totalImagesWithCaption = 0;
  let totalImagesWithoutCaption = 0;

  const images = Array.from(contentArea.querySelectorAll('img')).map(img => {
    const figure = img.closest('figure');
    const caption = figure ? figure.querySelector('figcaption') : null;
    
    const url = img.getAttribute('data-src') || img.src || '';
    const name = url.substring(url.lastIndexOf('/') + 1);
    const format = url.split('.').pop();

    if (format) {
      imageFormatsCount[format] = (imageFormatsCount[format] || 0) + 1;
    }

    if (img.alt) {
      totalImagesWithAlt++;
    } else {
      totalImagesWithoutAlt++;
    }

    if (img.title) {
      totalImagesWithTitle++;
    } else {
      totalImagesWithoutTitle++;
    }

    if (caption) {
      totalImagesWithCaption++;
    } else {
      totalImagesWithoutCaption++;
    }

    return {
      id: imageIdCounter++,
      alt_text: img.alt || '',
      url: url,
      name: name,
      format: format,
      caption: caption ? caption.textContent : ''
    };
  });

  const links = Array.from(contentArea.querySelectorAll('a')).map(link => ({
    link_id: linkIdCounter++,
    anchor: link.textContent || '',
    url: link.href || '',
    is_external: link.hostname !== location.hostname,
    is_nofollow: link.rel.includes('nofollow'),
    is_new_tab: link.target === '_blank'
  }));

  const totalUrls = links.length;
  const totalDuplicatedUrls = links.length - new Set(links.map(link => link.url)).size;
  const totalNewTabUrls = links.filter(link => link.is_new_tab).length;
  const totalInternalLinks = links.filter(link => !link.is_external).length;
  const totalExternalLinks = links.filter(link => link.is_external).length;
  const totalNoFollowUrls = links.filter(link => link.is_nofollow).length;

  return {
    images,
    links,
    overview: {
      totalImages: images.length,
      imageFormatsCount,
      totalImagesWithAlt,
      totalImagesWithoutAlt,
      totalImagesWithTitle,
      totalImagesWithoutTitle,
      totalImagesWithCaption,
      totalImagesWithoutCaption,
      totalUrls,
      totalDuplicatedUrls,
      totalNewTabUrls,
      totalInternalLinks,
      totalExternalLinks,
      totalNoFollowUrls
    }
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getImagesAndLinks') {
    sendResponse(getImagesAndLinks());
  } else if (request.action === 'getContentOverview') {
    sendResponse(getContentOverview());
  }
});
