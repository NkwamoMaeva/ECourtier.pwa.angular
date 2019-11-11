FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY ["./package*.json", "./yarn.lock", "./"]
RUN npm install -g yarn @angular/cli && yarn install

# Bundle app source
COPY . .

# Exports
EXPOSE 80
CMD [ "npm", "start" ]