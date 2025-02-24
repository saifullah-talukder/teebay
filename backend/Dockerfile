FROM node:22-alpine

WORKDIR /app

RUN npm install pm2 -g

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production
ENV HTTP_PORT=4000

CMD ["npm", "start"]
