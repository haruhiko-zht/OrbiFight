import { FastifyInstance } from 'fastify';
import { matchRoutes } from './match';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(matchRoutes, { prefix: '/api/match' });
}
