FROM node:20

WORKDIR /user-service

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
