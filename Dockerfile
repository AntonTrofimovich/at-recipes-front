FROM node:12-alpine
WORKDIR /recipes-front
COPY . .
RUN npm i
CMD ["npm", "start"]