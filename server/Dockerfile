FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres" npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
