import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'server/db.json'));
const middlewares = jsonServer.defaults();

// Reescribir las rutas para que usen /api/v1/
server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1',
}));

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
}); 