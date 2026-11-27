# Ecom React frontend

## Requirements
- Node.js LTS and npm
- Spring Boot backend running on `http://localhost:8080`

## Install and run
```bash
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## Production build
```bash
npm run build
npm run preview
```

## Backend endpoints expected
- POST `/register` with `{ "username": "...", "password": "..." }`
- POST `/login` returns `{ "token": "...", "type": "Bearer" }`
- POST `/logout` with Bearer token
- GET `/api/users/me` with Bearer token returns `{ "username": "...", "role": "USER" | "ADMIN" }`
- GET `/api/products`
- GET `/api/product/{id}`
- GET `/api/products/search?keyword=...`
- GET `/api/product/{id}/image`
- POST `/api/product` multipart fields `product` (JSON part) and `imageFile` (file)
- PUT `/api/product/{id}` multipart fields `product` (JSON part), optional `imageFile`
- DELETE `/api/products/{id}`
- POST `/api/orders` body `{ "items": [{ "productId": 1, "quantity": 2 }] }`
- GET `/api/orders/my-orders`
- GET `/api/orders/{orderId}`

## Important backend notes
1. Add the authenticated profile endpoint shown in the main setup instructions if you do not already have one. The frontend uses it to identify USER vs ADMIN.
2. The ProductController update endpoint must accept `@PathVariable int id` and pass it to the service. The frontend sends PUT `/api/product/{id}`.
3. Configure Spring Security CORS to allow `http://localhost:5173`.
4. Do not rely on frontend role checks for security. Keep backend `@PreAuthorize` checks.
5. Set `VITE_API_BASE_URL` to the deployed backend origin for production.
