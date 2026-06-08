FROM node:18-alpine

WORKDIR /app/backend

RUN apk add --no-cache sqlite

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 8000

CMD ["npm", "start"]
