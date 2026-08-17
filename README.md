# An Bình – Web Gọi Món Bằng QR Code

Hệ thống gọi món tận bàn cho **Vườn Sinh Thái An Bình**: khách quét mã QR trên bàn →
xem thực đơn đúng như bảng menu của quán → gọi món + ghi chú → chủ quán nhận
thông báo (có chuông) theo thời gian thực trên một trang quản lý riêng.

## Cấu trúc dự án

```
qr-menu-app/
├─ client/     → Web khách gọi món + trang quản lý (React + TypeScript + Vite, PWA)
└─ server/     → Backend nhận đơn & bắn thông báo real-time (Express + Socket.io)
```

Đây là 2 ứng dụng **triển khai riêng biệt**:
- `client` deploy lên **Vercel** (miễn phí, tĩnh, nhanh).
- `server` deploy lên một nơi chạy **Node.js liên tục** như **Render** hoặc
  **Railway** (Vercel không chạy được Socket.io ổn định vì dùng serverless
  function, không giữ kết nối realtime lâu dài).

---

## 1. Chạy thử ở máy tính (local)

Yêu cầu: đã cài [Node.js](https://nodejs.org) bản 18 trở lên.

⚠️ **Bắt buộc phải chạy CẢ backend (server) LẪN frontend (client) cùng lúc.**
Nếu chỉ mở `client` mà quên bật `server`, khách sẽ không gửi được món (lỗi
`ERR_CONNECTION_REFUSED` khi gọi `localhost:4000`) và trang bếp sẽ không tải
được đơn hàng — đây gần như luôn là nguyên nhân của lỗi đó.

**Cách dễ nhất — chạy 1 lệnh duy nhất ở thư mục gốc `qr-menu-app`:**

```bash
cd qr-menu-app
cp server/.env.example server/.env
cp client/.env.example client/.env
npm install            # cài concurrently ở gốc
npm run install:all    # cài cho cả server và client
npm run dev            # chạy song song cả server (:4000) và client (:5173)
```

Mở trình duyệt: `http://localhost:5173`.

**Hoặc chạy tách riêng 2 terminal (nếu muốn xem log riêng từng bên):**

```bash
# Terminal 1
cd server && cp .env.example .env && npm install && npm run dev
# Backend chạy tại http://localhost:4000

# Terminal 2
cd client && cp .env.example .env && npm install && npm run dev
# Mở trình duyệt: http://localhost:5173
```

Vào `http://localhost:5173/?table=1` để xem thực đơn của "Bàn 1".
Vào `http://localhost:5173/admin` (hoặc `/kitchen`) để đăng nhập **trang
Bếp / Quản lý** — nơi nhận thông báo có chuông khi khách gọi món, và có nút
**"Mã QR bàn"** để tạo/in mã QR cho 10 bàn (mật khẩu mặc định: `anbinh2026`,
đổi trong `server/.env`).

---

## 2. Đưa code lên GitHub

```bash
cd qr-menu-app
git init
git add .
git commit -m "Khởi tạo web gọi món An Bình"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
git push -u origin main
```

---

## 3. Deploy backend (server) lên Render — miễn phí

1. Vào [render.com](https://render.com) → đăng nhập bằng GitHub.
2. **New +** → **Web Service** → chọn repo vừa push.
3. Điền cấu hình:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Thêm **Environment Variables**:
   - `ADMIN_PASSWORD` = mật khẩu quản lý bạn muốn dùng
   - `TABLE_COUNT` = `10`
5. Bấm **Create Web Service**. Sau khi build xong, Render cho bạn một URL
   dạng `https://an-binh-server.onrender.com` — **lưu lại URL này**, bước sau
   cần dùng.

> Lưu ý: gói free của Render sẽ "ngủ" sau ~15 phút không có ai gọi, lần gọi
> đầu tiên sau khi ngủ sẽ chậm vài giây — đây là giới hạn của gói miễn phí,
> nếu quán đông khách nên nâng cấp gói trả phí nhỏ để chạy 24/7 không ngủ.

**Cách khác:** Railway.app cũng làm tương tự (New Project → Deploy from
GitHub repo → Root Directory `server` → thêm biến môi trường như trên).

---

## 4. Deploy frontend (client) lên Vercel

1. Vào [vercel.com](https://vercel.com) → đăng nhập bằng GitHub.
2. **Add New** → **Project** → chọn repo vừa push.
3. Khi Vercel hỏi cấu hình:
   - **Root Directory**: chọn `client`
   - Framework Preset: Vercel sẽ tự nhận diện **Vite**
   - Build Command: `npm run build` (mặc định, không cần đổi)
   - Output Directory: `dist` (mặc định, không cần đổi)
4. Thêm **Environment Variable**:
   - `VITE_API_URL` = URL backend ở bước 3, vd
     `https://an-binh-server.onrender.com`
5. Bấm **Deploy**. Xong, bạn có một địa chỉ dạng
   `https://an-binh-menu.vercel.app`.

Muốn gắn tên miền riêng của quán (vd `menu.vuonanbinh.com`): vào
**Project → Settings → Domains** trên Vercel và làm theo hướng dẫn trỏ DNS.

---

## 5. Tạo & in mã QR cho 10 bàn

1. Truy cập `https://<domain-cua-ban>/admin` → đăng nhập.
2. Vào **Mã QR bàn**.
3. Ô "Địa chỉ website" tự điền sẵn domain hiện tại — kiểm tra lại cho đúng
   domain đã deploy ở Vercel (hoặc tên miền riêng nếu đã gắn).
4. Bấm **In trang này** → in ra → cắt từng mã QR → dán/đặt lên từng bàn
   tương ứng (Bàn 1 → 10).

Khi khách quét mã QR của Bàn 5, họ sẽ vào thẳng
`https://<domain>/?table=5` và thấy đúng số bàn đó ở góc màn hình — đơn gọi
món sẽ tự gắn đúng số bàn, không cần khách tự chọn.

---

## 6. Cài icon web lên màn hình điện thoại (PWA)

Vì trang được cấu hình sẵn PWA (`manifest.json` + icon), khách hoặc chủ quán
có thể "cài" web như một app:

- **Android (Chrome)**: mở trang → menu ⋮ → **Thêm vào Màn hình chính**.
- **iPhone (Safari)**: mở trang → nút Chia sẻ → **Thêm vào Màn hình chính**.

Trang quản lý (`/admin`) nên được chủ quán cài riêng trên điện thoại/máy
tính bảng của quán để tiện bật lên xem đơn và nghe chuông thông báo.

---

## 7. Cách chủ quán sử dụng trang quản lý

1. Mở `/admin`, đăng nhập bằng mật khẩu (`ADMIN_PASSWORD` đã đặt).
2. Ở trang **Đơn đặt món**:
   - Mỗi đơn khách gửi lên sẽ tự hiện ra ngay lập tức kèm **chuông báo**
     và (nếu đã bấm "Bật thông báo") thông báo đẩy của trình duyệt.
   - Lọc theo từng bàn bằng các nút "Bàn 1" ... "Bàn 10" phía trên, bàn nào
     có đơn đang chờ sẽ có chấm đỏ.
   - Bấm **Đang chuẩn bị** / **Đã xong** / **Huỷ đơn** để cập nhật trạng
     thái — trạng thái này đồng bộ ngay trên mọi thiết bị đang mở trang
     quản lý (vd: bếp và thu ngân cùng xem).
3. Nút 🔔/🔕 ở góc trên để bật/tắt âm thanh chuông trên thiết bị đó.
4. Cuối trang có nút **Xoá toàn bộ lịch sử đơn** — dùng khi bắt đầu ngày
   mới, xoá là mất hết, không khôi phục được.

---

## 8. Chỉnh sửa thực đơn / giá

Toàn bộ món ăn nằm trong một file duy nhất:
`client/src/data/menu.ts`

Mỗi món có dạng:

```ts
{ id: "khoai-tay-chien", name: "Khoai tây chiên", price: 60000 }
```

- Món tính theo thời giá / chưa có giá cố định: đặt `price: null`.
- Món có đơn vị riêng (con, kg, tô, ống): thêm `unit: "/con"`.
- Món có nhiều cách chế biến cùng giá: thêm mảng `options: [...]`.

Sửa xong, đẩy code lên GitHub — Vercel sẽ tự động build & deploy lại.

---

## 9. Xử lý lỗi thường gặp

### `Failed to load resource: net::ERR_CONNECTION_REFUSED` tại `localhost:4000`

Nghĩa là trình duyệt gọi tới backend nhưng không ai đang lắng nghe ở cổng đó.
Kiểm tra theo thứ tự:

1. **Server đã bật chưa?** Ở thư mục `server`, chạy `npm run dev` — phải thấy
   dòng `✅ An Binh menu server đang chạy tại http://localhost:4000`. Nếu chưa
   chạy, `client` sẽ không bao giờ gửi được đơn — đây là nguyên nhân phổ biến
   nhất.
2. **Đang chạy đúng cả 2 chưa?** Dùng `npm run dev` ở thư mục gốc để chạy
   song song cả hai, tránh quên bật một bên (xem mục 1).
3. **Đã deploy thật (không phải chạy local) nhưng vẫn thấy `localhost:4000`?**
   Nghĩa là biến môi trường `VITE_API_URL` trên Vercel chưa được đặt (hoặc đặt
   sai) — client sẽ tự động dùng `localhost:4000` làm mặc định khi thiếu biến
   này. Vào **Vercel → Project → Settings → Environment Variables**, thêm
   `VITE_API_URL` trỏ đúng URL server đã deploy (vd
   `https://an-binh-server.onrender.com`), rồi **Redeploy** lại.
4. Khi mất kết nối, trang khách và trang bếp sẽ tự hiện **banner cảnh báo màu
   đỏ** ở đầu trang kèm nút **"Thử kết nối lại"** — bấm để kiểm tra lại ngay
   mà không cần tải lại trang. Trang cũng tự dò kết nối lại mỗi 6 giây khi
   đang mất kết nối, nên khi bật server lên, trang sẽ tự khôi phục.

### Không thấy "trang bếp" / bị đá về lại trang đăng nhập

Trang bếp chính là `/admin` (đăng nhập) → `/admin/dashboard` (bảng đơn hàng
có chuông báo), hoặc vào tắt qua đường dẫn ngắn `/kitchen`. Ở bản trước, nếu
mất kết nối server ngay sau khi đăng nhập, hệ thống sẽ tự đăng xuất khiến
tưởng nhầm là "không có trang bếp" — lỗi này đã được sửa: giờ chỉ đăng xuất
khi **sai mật khẩu**, còn mất kết nối sẽ hiện banner đỏ và tự tải lại đơn khi
server kết nối được trở lại.

### Không thấy mã QR

Mã QR nằm trong trang Bếp / Quản lý: đăng nhập `/admin` → bấm nút **"Mã QR
bàn"** ở góc trên (hoặc vào thẳng `/admin/qrcodes` sau khi đăng nhập). Trang
này chỉ tải được sau khi đăng nhập thành công, nên nếu bước đăng nhập đang bị
lỗi kết nối (mục trên), hãy xử lý lỗi đó trước.

### Không thấy màn hình "Thoát" / lời cảm ơn sau khi gọi món

Sau khi bấm **"Gửi món cho bếp"** thành công, một hộp thoại hiện lên với 2
nút: **"Gọi thêm món"** (quay lại thực đơn để đặt tiếp) và **"Thoát"** (hiện
màn hình cảm ơn, chúc ngon miệng toàn màn hình). Nếu muốn xem lại thực đơn từ
màn hình Thoát, bấm nút **"Xem lại thực đơn / gọi thêm món"** ở cuối màn hình
đó.

---

## 10. Giới hạn hiện tại (có thể nâng cấp thêm)

- Dữ liệu đơn hàng lưu trong 1 file JSON trên server (đủ dùng cho quán vừa
  và nhỏ). Muốn lưu lâu dài, nhiều dữ liệu, nên chuyển sang cơ sở dữ liệu
  thật (PostgreSQL, MongoDB...).
- Chưa có tài khoản riêng cho từng nhân viên — chỉ có 1 mật khẩu quản lý
  dùng chung.
- Chưa tích hợp thanh toán online — hệ thống chỉ dùng để gọi món, thanh
  toán vẫn thực hiện trực tiếp tại quán.
