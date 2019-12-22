FROM node:6.11.5 
WORKDIR /usr/src/app 
COPY package.json .
RUN npm install
COPY . /usr/src/app
CMD ["npm", "start"]

