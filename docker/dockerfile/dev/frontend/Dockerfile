FROM node:lts-alpine3.19

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app
COPY package.json .

RUN npm install -f

CMD ["npm", "run", "dev"]


