# HR Attrition Prediction System

Ứng dụng hỗ trợ phân tích và dự đoán nguy cơ nghỉ việc của nhân viên.

## Công nghệ sử dụng

- Backend: FastAPI, SQLAlchemy, scikit-learn
- Frontend: React + Vite
- Database: PostgreSQL
- Dữ liệu mẫu: `WA_Fn-UseC_-HR-Employee-Attrition.csv`

## Yêu cầu môi trường

Trước khi cài đặt, máy cần có:

- Python 3.10 trở lên
- Node.js 18 trở lên
- PostgreSQL 14 trở lên
- npm

Khuyến nghị:

- Python 3.13
- Node.js 20+

## Cấu trúc chính của dự án

```text
source/
|-- backend/                         # FastAPI + Machine Learning
|-- frontend/                        # React + Vite
|-- WA_Fn-UseC_-HR-Employee-Attrition.csv
|-- start.bat                        # Chạy nhanh trên Windows
`-- README.md
```

## Lưu ý quan trọng trước khi cài

- Phiên bản hiện tại của backend đang đọc dữ liệu từ PostgreSQL cho hầu hết API, nên cần cấu hình database trước khi chạy ổn định.
- Frontend đang gọi API cố định tới `http://localhost:8000`, vì vậy nên giữ backend chạy ở cổng `8000`.

## 1. Tải mã nguồn

Nếu dùng Git:

```powershell
git clone <URL_REPOSITORY>
cd source
```

Nếu đã có sẵn mã nguồn, chỉ cần mở terminal tại thư mục gốc của dự án.

## 2. Tạo database PostgreSQL

Tạo database mới, ví dụ tên `hr_attrition`:

```sql
CREATE DATABASE hr_attrition;
```

Nếu cần tạo riêng user:

```sql
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE hr_attrition TO postgres;
```

## 3. Cấu hình backend

Di chuyển vào thư mục `backend`:

```powershell
cd backend
```

Tạo virtual environment:

```powershell
python -m venv .venv
```

Kích hoạt môi trường:

```powershell
.\.venv\Scripts\Activate.ps1
```

Trên macOS/Linux:

```bash
source .venv/bin/activate
```

Cài dependencies:

```powershell
pip install -r requirements.txt
```

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_attrition
```

Nếu tài khoản hoặc cổng PostgreSQL khác mặc định, thay lại cho phù hợp.

## 4. Khởi tạo dữ liệu ban đầu

Từ thư mục `backend`, chạy:

```powershell
python migrate_data.py
```

Script này sẽ:

- tạo bảng nếu chưa tồn tại
- đọc file CSV mẫu ở thư mục gốc
- import dữ liệu nhân viên vào PostgreSQL

Nếu bạn đang dùng database cũ đã tạo từ phiên bản trước, chạy thêm:

```powershell
python add_ahp_columns.py
```

Script này bổ sung các cột phục vụ AHP và theo dõi nhân viên. Với database tạo mới từ code hiện tại thì thường không cần bước này.

## 5. Chạy backend

Vẫn trong thư mục `backend`:

```powershell
python -m uvicorn run:app --reload --host 0.0.0.0 --port 8000
```

Khi chạy thành công, có thể kiểm tra:

- API root: `http://localhost:8000/`
- Health check: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## 6. Cài và chạy frontend

Mở terminal mới, di chuyển vào thư mục `frontend`:

```powershell
cd frontend
npm install
npm run dev
```

Sau khi chạy thành công, mở:

- Frontend: `http://localhost:5173`

## 7. Cách chạy nhanh trên Windows

Dự án có sẵn file `start.bat`:

```powershell
.\start.bat
```

Lưu ý:

- File này đang dùng đường dẫn Python cố định: `C:\laragon\bin\python\python-3.13\python.exe`
- Nếu máy khác đường dẫn này, cần sửa lại `start.bat` trước khi dùng

## 8. Kiểm tra sau khi cài đặt

Nên kiểm tra lần lượt:

1. `http://localhost:8000/health` trả về trạng thái `healthy`
2. `http://localhost:8000/docs` mở được Swagger
3. `http://localhost:5173` hiển thị giao diện web
4. Chạy thử chức năng huấn luyện hoặc xem danh sách nhân viên

## 9. Một số lỗi thường gặp

### Không kết nối được PostgreSQL

Kiểm tra lại:

- PostgreSQL đã chạy chưa
- `DATABASE_URL` trong `backend/.env` có đúng không
- database `hr_attrition` đã được tạo chưa

### Lỗi thiếu package Python

Chạy lại:

```powershell
pip install -r requirements.txt
```

Và đảm bảo đang kích hoạt đúng virtual environment.

### Frontend không gọi được backend

Kiểm tra:

- backend có đang chạy ở `http://localhost:8000` không
- frontend có đang chạy ở `http://localhost:5173` không
- firewall hoặc phần mềm bảo mật có chặn cổng nội bộ không

## 10. Các lệnh hữu ích

Backend:

```powershell
python migrate_data.py
python add_ahp_columns.py
python -m uvicorn run:app --reload --port 8000
```

Frontend:

```powershell
npm install
npm run dev
npm run build
```

## Tính năng chính

- Thống kê dữ liệu nhân sự
- Dự đoán nguy cơ nghỉ việc
- Phân tích theo phòng ban
- Quản lý nhân viên
- Ghi chú và mức độ cần chú ý
- AHP hỗ trợ đề xuất chiến lược giữ chân nhân sự

## Ghi chú thêm

- File dữ liệu mẫu nằm ở thư mục gốc: `WA_Fn-UseC_-HR-Employee-Attrition.csv`
- Model đã huấn luyện được lưu trong `backend/app/infrastructure/ml_service/saved_models/`
- Nếu đổi cổng backend, cần cập nhật lại `frontend/src/api/api.js`
