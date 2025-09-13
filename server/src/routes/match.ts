import { FastifyInstance } from 'fastify';
import { simulateMatch } from '../modules/match/service';

export async function matchRoutes(app: FastifyInstance) {
  app.post('/simulate', async (req, rep) => {
    const body = req.body as any;
    const result = await simulateMatch(body);
    return rep.send(result);
  });
}
