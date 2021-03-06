FROM node:12.14.0
WORKDIR /usr/src/app 
COPY package.json .
RUN npm install
COPY . /usr/src/app
CMD ["npm", "start"]

