# 1. Chọn môi trường Node.js
FROM node:24-alpine

# 2. Thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy file khai báo dependencies
COPY package*.json ./

# 4. Cài dependencies
RUN npm ci

# 5. Copy source code vào container
COPY . .

# 6. Build TypeScript thành JavaScript
RUN npm run build

# 7. Công bố port ứng dụng sử dụng
EXPOSE 3000

# 8. Khởi chạy ứng dụng
CMD ["node", "dist/main.js"]