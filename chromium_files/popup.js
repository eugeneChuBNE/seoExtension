document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8000/analyser/images/')
        .then(response => response.json())
        .then(data => {
            const imageSection = document.getElementById('image-data');
            data.forEach(image => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${image.image_id}</td><td>${image.alt_text}</td><td>${image.url}</td>`;
                imageSection.appendChild(row);
            });
        });

    fetch('http://localhost:8000/analyser/links/')
        .then(response => response.json())
        .then(data => {
            const linkSection = document.getElementById('link-data');
            data.forEach(link => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${link.link_id}</td><td>${link.anchor}</td><td>${link.url}</td>`;
                if (link.is_external) row.style.backgroundColor = '#D9EAD3';
                if (link.is_nofollow) row.style.color = '#FFFF00';
                if (link.is_new_tab) row.style.color = '#F4CCCC';
                linkSection.appendChild(row);
            });
        });
});
