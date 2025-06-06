FROM node:20

WORKDIR /activity-service

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]
