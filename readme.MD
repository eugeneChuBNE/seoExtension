# SEO Analyser Extension / Tiện ích phân tích SEO 

This project is an SEO supporting extension built using Django and MySQL. The extension is designed to analyse the content of the current tab, focusing on images and links, and provides functionalities for analysing and displaying statistics.

Dự án này là một tiện ích hỗ trợ SEO được xây dựng bằng Django và MySQL. Tiện ích được thiết kế để phân tích nội dung của tab hiện tại, tập trung vào hình ảnh và liên kết, và cung cấp các chức năng để phân tích và hiển thị số liệu thống kê.

## Project Structure / Cấu Trúc Dự Án

The project is organised into the following directories and files:
Dự án được tổ chức thành các thư mục và tệp sau:

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

## Files Description / Chi tiết các tệp

### `analyser` Directory / thư mục `analyser`

- **admin.py**

  Registers the models with the Django admin site, enabling you to manage `ImageData` and `LinkData` through the admin interface. This is helpful for administrators to easily view, add, and modify data.

  Đăng ký các mô hình với trang quản trị Django, cho phép quản lý ImageData và LinkData thông qua giao diện quản trị. Điều này hữu ích cho các quản trị viên dễ dàng xem, thêm, và sửa đổi dữ liệu.

- **models.py**

  Defines the `ImageData` and `LinkData` models, which represent the structure of the data stored in the database. `ImageData` holds information about images such as their alt text and URL, while `LinkData` stores information about links including the anchor text, URL, and various attributes like whether the link is external or has a `nofollow` attribute.

  Định nghĩa các mô hình  `ImageData` and `LinkData`, đại diện cho cấu trúc của dữ liệu được lưu trữ trong cơ sở dữ liệu. `ImageData` chứa thông tin về hình ảnh như văn bản thay thế và URL, trong khi `LinkData` lưu trữ thông tin về các liên kết bao gồm văn bản neo, URL, và các thuộc tính khác như liệu liên kết có là bên ngoài hoặc có thuộc tính `nofollow` hay không.

- **serializers.py**

  Contains serializers for the `ImageData` and `LinkData` models. Serializers convert the model instances into JSON format and vice versa, which is essential for sending and receiving data in a web API.
  
  Chứa các bộ tuần tự cho các mô hình `ImageData` và `LinkData`. Các bộ tuần tự chuyển đổi các thực thể mô hình thành định dạng JSON và ngược lại, cần thiết để gửi và nhận dữ liệu trong một web API.

- **urls.py**

  Maps URL paths to views. It defines routes for fetching images and links, which are handled by corresponding view functions. When a specific URL is requested, Django uses this file to determine which view should process the request.
  
  Ánh xạ các đường dẫn URL tới các view. Nó định nghĩa các tuyến đường để lấy hình ảnh và liên kết, được xử lý bởi các hàm view tương ứng. Khi một URL cụ thể được yêu cầu, Django sử dụng tệp này để xác định view nào sẽ xử lý yêu cầu đó.

- **views.py**

  Contains the view functions that handle HTTP requests. For example, the `fetch_images` and `fetch_links` functions retrieve all image and link data from the database and return it in JSON format. These views interact with the serializers to convert data to and from JSON.
  
  Chứa các hàm view xử lý các yêu cầu HTTP. Ví dụ, các hàm `fetch_images` và `fetch_links` lấy tất cả dữ liệu hình ảnh rồi liên kết từ cơ sở dữ liệu và trả về dưới dạng JSON. Các view này tương tác với các bộ tuần tự để chuyển đổi dữ liệu đến và từ định dạng JSON.

### `chromium_files` Directory / thư mục `chromium_files`

- **background.js**

  Part of the Chrome extension and handles background events. It listens for the extension icon to be clicked, then executes the content script (`content.js`).

  Là một phần của tiện ích Chrome và xử lý các sự kiện nền. Nó lắng nghe khi biểu tượng tiện ích được nhấp, sau đó thực thi tập lệnh nội dung (`content.js`).

- **content.js**

  Runs in the context of the web page the user is viewing. It extracts image and link data from the page, formats it, and sends it to the Django backend via HTTP requests. It uses the DOM to select relevant elements and gathers their attributes.

  Chạy trong bối cảnh của trang web mà người dùng đang xem - trích xuất dữ liệu hình ảnh và liên kết từ trang, định dạng nó và gửi đến backend Django qua các yêu cầu HTTP. Nó sử dụng DOM để chọn các phần tử liên quan và thu thập các thuộc tính của chúng.

- **manifest.json**

  The configuration file for the Chrome extension. It defines the extension's metadata (name, version, permissions, etc.) and specifies which scripts to run in which contexts (background, content, popup).
  
  Tệp cấu hình cho tiện ích Chrome. Nó định nghĩa siêu dữ liệu của tiện ích (tên, phiên bản, quyền, v.v.) và chỉ định các tập lệnh nào sẽ chạy trong các ngữ cảnh nào (nền, nội dung, popup).

- **popup.html**

  Defines the HTML structure for the extension's popup interface. When the extension icon is clicked, this popup is displayed. It includes sections to display image and link data fetched from the Django backend.
  
  Định nghĩa cấu trúc HTML cho giao diện popup của tiện ích. Khi biểu tượng tiện ích được nhấp, popup này sẽ hiển thị. Nó bao gồm các phần để hiển thị dữ liệu hình ảnh và liên kết được lấy từ backend Django.

- **popup.js**

  Runs within the popup and fetches data from the Django backend to display in the popup interface. It makes HTTP requests to the endpoints defined in Django and updates the HTML content of the popup with the received data.
  
  Chạy trong popup và lấy dữ liệu từ backend Django để hiển thị trong giao diện popup. Nó thực hiện các yêu cầu HTTP đến các điểm cuối được định nghĩa trong Django và cập nhật nội dung HTML của popup với dữ liệu nhận được.

### `seo_extension` Directory

- **settings.py**

  Contains the Django project settings, including database configuration, installed apps, middleware, and other configurations. It specifies MySQL as the database engine and includes settings for security, debugging, and static files.
  
  Chứa các cài đặt của dự án Django, bao gồm cấu hình cơ sở dữ liệu, các ứng dụng được cài đặt, middleware và các cấu hình khác. Nó chỉ định MySQL là công cụ cơ sở dữ liệu và bao gồm các cài đặt cho bảo mật, gỡ lỗi, và tệp tĩnh.

- **urls.py**

  Defines the URL patterns for the Django project. It includes the admin interface and the URL routes for the `analyser` app, delegating specific paths to be handled by the `analyser.urls` module.
  
  Định nghĩa các mẫu URL cho dự án Django. Nó bao gồm giao diện quản trị và các tuyến đường URL cho ứng dụng `analyser`, ủy quyền các đường dẫn cụ thể để được xử lý bởi module `analyser.urls`.

## How It Works / Cách thức hoạt động

1. **Data Collection / Thu thập dữ liệu (Chrome Extension)**:
   - When the extension icon is clicked, `background.js` triggers `content.js` to run in the context of the current web page.
   
   Khi biểu tượng tiện ích được nhấp, `background.js`  kích hoạt `content.js` chạy trong bối cảnh của trang web hiện tại.

   - `content.js` collects image and link data from the web page and sends it to the Django backend via HTTP POST requests.
   
   `content.js` thu thập dữ liệu hình ảnh và liên kết từ trang web và gửi nó đến backend Django qua các yêu cầu HTTP POST.

2. **Data Handling / Xử lý dữ liệu (Django Backend)**:
   - The Django backend receives the data through the views defined in `views.py`.
   
   Backend Django nhận dữ liệu thông qua các view được định nghĩa trong `views.py.

   - These views use serializers to validate and save the data into the MySQL database.
   
   Các view này sử dụng các bộ tuần tự để xác thực và lưu dữ liệu vào cơ sở dữ liệu MySQL.

3. **Data Display / Hiển thị dữ liệu (Extension Popup)**:
   - When the extension popup is opened, `popup.js` fetches the stored image and link data from the Django backend via HTTP GET requests.
   
   Khi popup của tiện ích được mở, `popup.js` lấy dữ liệu hình ảnh và liên kết đã lưu từ backend Django qua các yêu cầu HTTP GET.

   - The data is then displayed in the popup's HTML table structure defined in `popup.html`.

   Dữ liệu sau đó được hiển thị trong cấu trúc bảng HTML của popup được định nghĩa trong `popup.html`.


4. **Admin Interface / Giao diện quản trị**:
   - The `admin.py` file registers the models with the Django admin site, allowing administrators to view and manage the collected data through a web interface.
   
   Tệp `admin.py` đăng ký các mô hình với trang quản trị Django, cho phép các quản trị viên xem và quản lý dữ liệu thu thập thông qua một giao diện web.
