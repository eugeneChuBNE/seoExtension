# SEO Analyser Extension

This project is an SEO supporting extension built using Django and MySQL. The extension is designed to analyse the content of the current tab, focusing on images and links, and provides functionalities for analysing and displaying statistics.

## Project Structure

The project is organised into the following directories and files:

- `seo_extension/`
  - `analyser/`
    - `migrations/`
        - `__init__.py`
    - `__init__.py`
    - `admin.py`
    - `apps.py`
    - `models.py`
    - `serializers.py`
    - `test.py`
    - `urls.py`
    - `views.py`
  - `chromium_files/`
    - `background.js`
    - `content.js`
    - `manifest.json`
    - `popup.html`
    - `popup.js`
  - `seo_extension/`
    - `__init__.py`
    - `asgi.py`
    - `wsgi.py`
    - `settings.py`
    - `urls.py`
  - `manage.py`

## Files Description

### `analyser` Directory

- **admin.py**

  Registers the models with the Django admin site, enabling you to manage `ImageData` and `LinkData` through the admin interface. This is helpful for administrators to easily view, add, and modify data.

- **models.py**

  Defines the `ImageData` and `LinkData` models, which represent the structure of the data stored in the database. `ImageData` holds information about images such as their alt text and URL, while `LinkData` stores information about links including the anchor text, URL, and various attributes like whether the link is external or has a `nofollow` attribute.

- **serializers.py**

  Contains serializers for the `ImageData` and `LinkData` models. Serializers convert the model instances into JSON format and vice versa, which is essential for sending and receiving data in a web API.

- **urls.py**

  Maps URL paths to views. It defines routes for fetching images and links, which are handled by corresponding view functions. When a specific URL is requested, Django uses this file to determine which view should process the request.

- **views.py**

  Contains the view functions that handle HTTP requests. For example, the `fetch_images` and `fetch_links` functions retrieve all image and link data from the database and return it in JSON format. These views interact with the serializers to convert data to and from JSON.

### `chromium_files` Directory

- **background.js**

  Part of the Chrome extension and handles background events. It listens for the extension icon to be clicked, then executes the content script (`content.js`).

- **content.js**

  Runs in the context of the web page the user is viewing. It extracts image and link data from the page, formats it, and sends it to the Django backend via HTTP requests. It uses the DOM to select relevant elements and gathers their attributes.

- **manifest.json**

  The configuration file for the Chrome extension. It defines the extension's metadata (name, version, permissions, etc.) and specifies which scripts to run in which contexts (background, content, popup).

- **popup.html**

  Defines the HTML structure for the extension's popup interface. When the extension icon is clicked, this popup is displayed. It includes sections to display image and link data fetched from the Django backend.

- **popup.js**

  Runs within the popup and fetches data from the Django backend to display in the popup interface. It makes HTTP requests to the endpoints defined in Django and updates the HTML content of the popup with the received data.

### `seo_extension` Directory

- **settings.py**

  Contains the Django project settings, including database configuration, installed apps, middleware, and other configurations. It specifies MySQL as the database engine and includes settings for security, debugging, and static files.

- **urls.py**

  Defines the URL patterns for the Django project. It includes the admin interface and the URL routes for the `analyser` app, delegating specific paths to be handled by the `analyser.urls` module.

## How It Works

1. **Data Collection (Chrome Extension)**:
   - When the extension icon is clicked, `background.js` triggers `content.js` to run in the context of the current web page.
   - `content.js` collects image and link data from the web page and sends it to the Django backend via HTTP POST requests.

2. **Data Handling (Django Backend)**:
   - The Django backend receives the data through the views defined in `views.py`.
   - These views use serializers to validate and save the data into the MySQL database.

3. **Data Display (Extension Popup)**:
   - When the extension popup is opened, `popup.js` fetches the stored image and link data from the Django backend via HTTP GET requests.
   - The data is then displayed in the popup's HTML table structure defined in `popup.html`.

4. **Admin Interface**:
   - The `admin.py` file registers the models with the Django admin site, allowing administrators to view and manage the collected data through a web interface.

