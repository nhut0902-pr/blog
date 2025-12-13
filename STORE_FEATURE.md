# 🛒 Source Code Store Feature

## Tổng quan
Tính năng **Source Code Store** cho phép admin bán các source code với hệ thống liên hệ trực tiếp. Khách hàng có thể xem sản phẩm và gửi yêu cầu mua hàng, admin sẽ liên hệ lại để xử lý đơn hàng.

## ✨ Tính năng chính

### 🔐 **Admin Features**
- ✅ Tạo/sửa/xóa sản phẩm source code
- ✅ Đặt giá cho từng sản phẩm
- ✅ Upload hình ảnh sản phẩm
- ✅ Thêm demo URL và download URL
- ✅ Quản lý tags và categories
- ✅ Đánh dấu sản phẩm nổi bật (Featured)
- ✅ Quản lý đơn hàng (Pending/Completed/Cancelled)
- ✅ Xem thông tin liên hệ của khách hàng

### 👥 **User Features**
- ✅ Xem danh sách sản phẩm
- ✅ Lọc theo Featured/All products
- ✅ Xem chi tiết sản phẩm
- ✅ Xem demo (nếu có)
- ✅ Gửi yêu cầu mua hàng với thông tin liên hệ
- ✅ Sidebar hiển thị sản phẩm nổi bật

## 🎨 **UI/UX Design**
- **Tech-themed**: Giao diện cyber/terminal phù hợp với theme tổng thể
- **Responsive**: Mobile-first design với touch targets tối thiểu 44px
- **Animations**: Smooth transitions và hover effects
- **Color scheme**: Cyan/Indigo gradient với dark theme

## 📱 **Navigation**
- **Desktop**: Store link trong navbar với badge "NEW"
- **Mobile**: Store link trong hamburger menu
- **Admin**: Store Management và Purchase Orders trong admin menu
- **Sidebar**: Featured Store widget trên trang chủ

## 🗄️ **Database Schema**

### SourceCode Model
```prisma
model SourceCode {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  imageUrl    String?
  demoUrl     String?
  downloadUrl String?
  tags        String[]
  category    String?
  featured    Boolean  @default(false)
  active      Boolean  @default(true)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  purchases   Purchase[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Purchase Model
```prisma
model Purchase {
  id           String     @id @default(cuid())
  userId       String
  user         User       @relation(fields: [userId], references: [id])
  sourceCodeId String
  sourceCode   SourceCode @relation(fields: [sourceCodeId], references: [id])
  amount       Float
  status       PurchaseStatus @default(PENDING)
  contactInfo  String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

enum PurchaseStatus {
  PENDING
  COMPLETED
  CANCELLED
}
```

## 🔗 **API Endpoints**

### Public APIs
- `GET /api/store` - Lấy danh sách sản phẩm
- `GET /api/store/[id]` - Chi tiết sản phẩm
- `POST /api/store/[id]/purchase` - Tạo yêu cầu mua hàng

### Admin APIs
- `POST /api/store` - Tạo sản phẩm mới
- `PUT /api/store/[id]` - Cập nhật sản phẩm
- `DELETE /api/store/[id]` - Xóa sản phẩm
- `GET /api/admin/store` - Quản lý sản phẩm
- `GET /api/admin/purchases` - Quản lý đơn hàng
- `PUT /api/admin/purchases/[id]` - Cập nhật trạng thái đơn hàng

## 📄 **Pages Structure**

```
/store                    # Danh sách sản phẩm
/store/[id]              # Chi tiết sản phẩm
/admin/store             # Quản lý sản phẩm (Admin)
/admin/store/create      # Tạo sản phẩm mới (Admin)
/admin/purchases         # Quản lý đơn hàng (Admin)
```

## 🚀 **Workflow**

### Quy trình bán hàng:
1. **Admin tạo sản phẩm**: Truy cập `/admin/store` → "Add Product"
2. **User xem store**: Truy cập `/store` để browse sản phẩm
3. **User mua sản phẩm**: 
   - Click vào sản phẩm → "Liên hệ mua ngay"
   - Điền thông tin liên hệ (email, phone, etc.)
   - Gửi yêu cầu
4. **Admin xử lý**: 
   - Nhận thông báo đơn hàng mới
   - Liên hệ khách hàng qua thông tin đã cung cấp
   - Cập nhật trạng thái đơn hàng (Completed/Cancelled)

### Sample Products:
- ✅ React E-commerce Template (500,000 VND)
- ✅ Blog CMS với Next.js (300,000 VND)  
- ✅ Dashboard Analytics (400,000 VND)

## 🔧 **Setup Instructions**

1. **Database Migration**:
```bash
npx prisma generate
npx prisma db push
```

2. **Seed Sample Data**:
```bash
node scripts/seed-store.js
node scripts/test-purchase.js
```

3. **Environment Variables**:
```env
# Already configured in existing .env files
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_jwt_secret"
```

## 📊 **Features Status**

| Feature | Status | Description |
|---------|--------|-------------|
| Product CRUD | ✅ | Create, Read, Update, Delete products |
| Purchase System | ✅ | Contact-based purchase requests |
| Admin Dashboard | ✅ | Manage products and orders |
| Featured Products | ✅ | Highlight special products |
| Responsive Design | ✅ | Mobile-optimized interface |
| Search & Filter | ✅ | Filter by featured/all |
| Image Upload | ✅ | ImageKit integration |
| Demo Links | ✅ | External demo URLs |
| Notification System | ✅ | Admin notification badges |
| Tech Theme | ✅ | Cyber/terminal aesthetic |

## 🎯 **Future Enhancements**
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Download management system
- [ ] Customer reviews and ratings
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Sales analytics and reports
- [ ] Discount codes and promotions
- [ ] Bulk operations for admin

---

**Tính năng Store đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng! 🚀**