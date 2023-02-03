const fs = require('fs');
const fastify = require('fastify')({});

fastify.register(require('@fastify/accepts'))

fastify.get('/', function (request, reply) {
  reply
    .status(410)
    .send("Server decommissioned");
});

fastify.get('/.well-known/webfinger', function (request, reply) {
  reply
    .header('Content-Type', 'application/jrd+json; charset=utf-8')
    .send(fs.readFileSync('webfinger.json', 'utf8'));
});

fastify.get('/@andrewshell', function (request, reply) {
  const accept = request.accepts();
  switch (accept.type(['json', 'html'])) {
  case 'json':
    reply
      .header('Content-Type', 'application/activity+json; charset=utf-8')
      .send(fs.readFileSync('andrewshell.json', 'utf8'));
    break;
  default:
    reply.redirect(301, 'https://indieweb.social/@andrewshell');
  }
});

fastify.get('/users/andrewshell', function (request, reply) {
  const accept = request.accepts();
  switch (accept.type(['json', 'html'])) {
  case 'json':
    reply
      .header('Content-Type', 'application/activity+json; charset=utf-8')
      .send(fs.readFileSync('andrewshell.json', 'utf8'));
  default:
    reply.redirect(301, 'https://indieweb.social/users/andrewshell');
  }
});

fastify.listen({ port: process.env.PORT || 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})
