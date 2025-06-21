const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
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