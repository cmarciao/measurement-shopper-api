FROM node:18

WORKDIR /usr/src/app

COPY package.json  ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

RUN pnpm prisma generate

CMD pnpm prisma migrate dev --name create_measures_table && pnpm dev
