# Backend Cleanup and ES6 Conversion Plan

## Issues Identified
- Mixed syntax: Some files use ES6 (import/export), others use CommonJS (require/module.exports)
- Duplicate files for routes: products.js vs productRoutes.js, auth.js vs authRoutes.js, orders.js vs orderRoutes.js, adminRoutes.js vs admin/ folder
- Duplicate seed files: seed.js and seeds.js
- Incorrect import paths (e.g., ../src/models/ instead of ../models/)
- Missing "type": "module" in package.json

## Steps to Complete

### 1. Update package.json
- [ ] Add "type": "module" to support ES6 modules

### 2. Convert CommonJS to ES6 Syntax
- [ ] Convert backend/src/models/Cart.js to ES6
- [ ] Convert backend/src/models/Product.js to ES6
- [ ] Convert backend/src/models/User.js to ES6
- [ ] Convert backend/src/models/Order.js to ES6
- [ ] Convert backend/src/routes/products.js to ES6
- [ ] Convert backend/src/routes/auth.js to ES6
- [ ] Convert backend/src/routes/orders.js to ES6
- [ ] Convert backend/src/routes/admin/auth.js to ES6
- [ ] Convert backend/src/routes/admin/products.js to ES6
- [ ] Convert backend/src/routes/admin/orders.js to ES6
- [ ] Convert backend/seed.js to ES6

### 3. Fix Import Paths
- [ ] Fix paths in all converted files (remove ../src/ prefix)

### 4. Delete Duplicate Files
- [ ] Delete backend/src/routes/productRoutes.js (keep products.js)
- [ ] Delete backend/src/routes/authRoutes.js (keep auth.js)
- [ ] Delete backend/src/routes/orderRoutes.js (keep orders.js)
- [ ] Delete backend/src/routes/adminRoutes.js (keep admin/ folder)
- [ ] Delete backend/seeds.js (keep seed.js)

### 5. Update server.js
- [ ] Convert server.js to ES6 syntax
- [ ] Update imports to use correct paths and ES6 syntax

### 6. Test and Verify
- [ ] Run npm install to ensure dependencies work
- [ ] Test server startup
- [ ] Test basic API endpoints
