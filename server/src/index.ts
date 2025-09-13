import { buildApp } from './app/app';

const app = await buildApp();
const port = Number(process.env.PORT ?? 40103);
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`Server on http://localhost:${port}`);
});
