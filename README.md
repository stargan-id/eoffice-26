This is a Eoffice Project that serve the fondation off all the demo project

## Getting Started

```sh
pnpm install
```

copy .env.example

```sh
cp .env.example .env
```

run docker

```sh
docker compose up -d
```

push the database 

```sh
pnpm prisma:dbpush
```

seed database

```sh
pnpm prisma:seed
```

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
