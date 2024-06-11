let highlightedElement = null;
let currentDuplicateIndex = -1;
const duplicateLinks = [];

function getContentOverview() {
  const metaTitle = document.querySelector('title') ? document.querySelector('title').innerText : '';
  const metaDescription = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : '';
  const thumbnail = document.querySelector('meta[property="og:image"]') ? document.querySelector('meta[property="og:image"]').getAttribute('content') : '';
  const thumbnailAlt = document.querySelector(`img[src="${thumbnail}"]`) ? document.querySelector(`img[src="${thumbnail}"]`).alt : '';
  const contentElements = Array.from(document.querySelectorAll('#vnx_post_content > *')).filter(el => !Array.from(el.classList).some(cls => cls.includes('widget')));
  const wordCount = contentElements.reduce((count, el) => count + el.innerText.split(/\s+/).length, 0);

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

  const images = Array.from(contentArea.querySelectorAll('img')).filter(img => !img.closest('[class*="widget"]')).map(img => {
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

  const links = Array.from(contentArea.querySelectorAll('a')).filter(link => !link.closest('[class*="widget"]')).map(link => {
    const is_duplicated = Array.from(contentArea.querySelectorAll('a')).filter(l => l.href === link.href).length > 1;
    if (is_duplicated) {
      duplicateLinks.push(link);
    }
    return {
      link_id: linkIdCounter++,
      anchor: link.textContent || '',
      url: link.href || '',
      is_external: link.hostname !== location.hostname,
      is_nofollow: link.rel.includes('nofollow'),
      is_new_tab: link.target === '_blank',
      is_duplicated: is_duplicated
    };
  });

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

function highlightAnchor(anchorText) {
  // Remove highlight from the previously highlighted element
  if (highlightedElement) {
    highlightedElement.style.backgroundColor = '';
    highlightedElement = null;
  }

  // Find and highlight the new element
  const elements = document.querySelectorAll('a, span, div, p, h1, h2, h3, h4, h5, h6');
  elements.forEach(el => {
    if (el.textContent.trim() === anchorText.trim()) {
      el.style.backgroundColor = 'lightorange';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightedElement = el;
    }
  });
}

function scrollToAnchor(anchorText) {
  const elements = document.querySelectorAll('a, span, div, p, h1, h2, h3, h4, h5, h6');
  elements.forEach(el => {
    if (el.textContent.trim() === anchorText.trim()) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function findNextDuplicate(anchorText) {
  if (duplicateLinks.length === 0) return;

  currentDuplicateIndex++;
  if (currentDuplicateIndex >= duplicateLinks.length) {
    currentDuplicateIndex = 0;
  }

  const nextDuplicate = duplicateLinks[currentDuplicateIndex];
  nextDuplicate.style.backgroundColor = 'lightorange';
  nextDuplicate.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getImagesAndLinks') {
    sendResponse(getImagesAndLinks());
  } else if (request.action === 'getContentOverview') {
    sendResponse(getContentOverview());
  } else if (request.action === 'highlightAnchor') {
    highlightAnchor(request.anchorText);
  } else if (request.action === 'scrollToAnchor') {
    scrollToAnchor(request.anchorText);
  } else if (request.action === 'findNextDuplicate') {
    findNextDuplicate(request.anchorText);
  }
});
