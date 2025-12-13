# 🚀 Production Deployment Guide

## 📋 **Pre-Deployment Checklist**

### 🔧 **Environment Variables**
Make sure these are set in your production environment:

```bash
# Database
DATABASE_URL="your-production-database-url"

# Authentication
JWT_SECRET="your-secure-jwt-secret-key"

# App
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Optional: Image Upload (if using external service)
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="your-imagekit-url"
```

### 🗄️ **Database Setup**

1. **Run Migrations:**
```bash
npx prisma migrate deploy
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Seed Store Data (Optional):**
```bash
node scripts/seed-store.js
```

### 📁 **File Upload Directory**
Ensure the uploads directory exists:
```bash
mkdir -p public/uploads
```

## 🎯 **Deployment Steps**

### 1. **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. **Manual Deployment**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## ✅ **Post-Deployment Verification**

### 🧪 **Test These Features:**

1. **Public Store:**
   - [ ] Visit `/store` - should show products
   - [ ] Click on a product - should show details
   - [ ] Try to purchase - should show contact form

2. **Admin Features (login as admin):**
   - [ ] Visit `/admin/store` - should show management dashboard
   - [ ] Create a new product - should work with image upload
   - [ ] Edit existing product - should save changes
   - [ ] View purchase orders - should show pending orders

3. **API Endpoints:**
   - [ ] `GET /api/store` - should return products
   - [ ] `GET /api/store/[id]` - should return product details
   - [ ] Admin endpoints should require authentication

## 🔐 **Security Notes**

- JWT tokens are httpOnly cookies
- Admin routes are protected by role-based access
- File uploads are validated for type and size
- All user inputs are sanitized

## 📊 **Monitoring**

Monitor these metrics after deployment:
- API response times
- Database query performance
- File upload success rates
- User registration/login rates
- Purchase request volumes

## 🆘 **Troubleshooting**

### Common Issues:

1. **Prisma Client Errors:**
   ```bash
   npx prisma generate
   ```

2. **Database Connection:**
   - Check DATABASE_URL format
   - Ensure database is accessible from production

3. **File Upload Issues:**
   - Check uploads directory permissions
   - Verify file size limits

4. **Authentication Problems:**
   - Verify JWT_SECRET is set
   - Check cookie settings for HTTPS

## 🎉 **Success!**

Your BlogApp with Source Code Store is now live! 

**Key URLs:**
- Store: `https://your-domain.com/store`
- Admin: `https://your-domain.com/admin`
- API: `https://your-domain.com/api/store`

---

**🚀 Happy selling! Your source code store is ready for business!**