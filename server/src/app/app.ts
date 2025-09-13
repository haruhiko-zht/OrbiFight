import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from '../routes';

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await registerRoutes(app);
  return app;
}
