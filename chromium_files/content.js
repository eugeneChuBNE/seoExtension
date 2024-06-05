function getImagesAndLinks() {
    const contentArea = document.querySelector('#vnx_post_content');
    if (!contentArea) {
      return { images: [], links: [] };
    }
  
    let imageIdCounter = 1;
    let linkIdCounter = 1;
  
    const images = Array.from(contentArea.querySelectorAll('img')).map(img => {
      const figure = img.closest('figure');
      const caption = figure ? figure.querySelector('figcaption') : null;
      
      // Prioritize data-src or data-srcset if they exist
      const url = img.getAttribute('data-src') || img.src || '';
      const name = url.substring(url.lastIndexOf('/') + 1);
  
      return {
        id: imageIdCounter++,
        alt_text: img.alt || '',
        url: url,
        name: name,
        format: url.split('.').pop(),
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
  
    return { images, links };
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getImagesAndLinks') {
      sendResponse(getImagesAndLinks());
    }
  });
  