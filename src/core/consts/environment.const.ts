export const environment = {
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '1234',
    name: process.env.DATABASE_NAME || 'postgres',
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'big_secret',
  },
  image: {
    publicKey: process.env.IMAGE_PUBLIC_KEY || 'key',
    privateKey: process.env.IMAGE_PRIVATE_KEY || 'key',
    urlEndpoint: process.env.IMAGE_URL_ENDPOINT || 'url',
  },
  here: {
    apiKey: process.env.HERE_API_KEY,
  },
};
