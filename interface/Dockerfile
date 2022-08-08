FROM node:latest
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
ENV PORT 8000
EXPOSE 8000
RUN npm install
COPY . ./
CMD ["npm", "start"]
