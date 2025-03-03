# Medanketa

Medanketa - a healthcare project that aims to make it easier for patients to complete surveys.

## Tech stack

This project (backend) works on Node js / Express / TypeScript / Postgresql / Sequelize ORM.

## Development

To run development build:

```bash
npm run dev
```

## Unit testing

To run unit testing:

```bash
npm run test
```

## Building for production

To create production build:

```bash
npm run build
```

## Production setup

Please build project first, then use /dist directory and index.js file (please don't use ts-node in production, it's bad for performance)

For example:

```bash
pm2 /dist/index.js
```
