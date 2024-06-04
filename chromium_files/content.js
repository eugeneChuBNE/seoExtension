function fetchImages() {
    const images = document.querySelectorAll('#vnx_post_content img');
    const imageData = Array.from(images).map((img, index) => ({
        id: index + 1,
        alt_text: img.alt || '',
        url: img.src
    }));

    fetch('http://localhost:8000/analyser/images/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images: imageData })
    });
}

function fetchLinks() {
    const links = document.querySelectorAll('#vnx_post_content a');
    const linkData = Array.from(links).map((link, index) => ({
        id: index + 1,
        anchor: link.innerText || '',
        url: link.href,
        is_external: link.href.startsWith('http'),
        is_nofollow: link.rel.includes('nofollow'),
        is_new_tab: link.target === '_blank'
    }));

    fetch('http://localhost:8000/analyser/links/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ links: linkData })
    });
}

fetchImages();
fetchLinks();
