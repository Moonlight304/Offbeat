FROM node:alpine
WORKDIR /server
COPY package*.json .
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
