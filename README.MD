# 🏡 Smart Home Mobile App
Smart Home Mobile là ứng dụng di động giúp người dùng giám sát và điều khiển các thiết bị trong nhà từ xa với các chức năng chính là điều khiển tự động quạt, đèn, máy phun sương dựa trên các dữ liệu trả về của cảm biến độ ẩm, ánh sáng, nhiệt độ và mở cửa từ xa thông minh.

# 🚀 Công nghệ sử dụng
React Native (Expo)

Expo Router - Điều hướng giữa các màn hình

Axios - Giao tiếp với API backend

Context API - Quản lý trạng thái ứng dụng

TypeScript

# ⚙️ Hướng dẫn cài đặt (Chế độ Development)
1. Clone source code về máy
git clone [<link-repository>](https://github.com/thinhnguyen07022004/FE_SmartHome_Mobile.git)
cd FE_SmartHome_Mobile
2. Cài đặt thư viện
npm install hoặc yarn install
3. Cập nhật file .env (nếu cần thiết)
Tạo file .env tại thư mục gốc của dự án và thêm các biến môi trường như sau:

EXPO_PUBLIC_API_URL=http://localhost:3001

EXPO_PUBLIC_API_URL=http://10.0.2.2:3001

EXPO_PUBLIC_ANDROID_API_URL=http://10.0.2.2:3001

EXPO_PUBLIC_IOS_API_URL=http://localhost:3001

EXPO_PUBLIC_ADAFRUIT_API_URL=https://io.adafruit.com/api/v2

Ghi chú:

Thay thế URL phù hợp với server backend bạn đang sử dụng.

# 4. Chạy ứng dụng
npm start hoặc npm run dev

Ứng dụng sẽ khởi động trên trình giả lập hoặc thiết bị thực (qua Expo GO trên GGPlay(AppStore)).
