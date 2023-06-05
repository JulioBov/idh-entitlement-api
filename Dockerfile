FROM public.ecr.aws/bitnami/node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

ENV NODE_ENV=production
CMD ["npm", "run", "serve"]