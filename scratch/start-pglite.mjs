import { PGlite } from '@electric-sql/pglite';
import { createServer } from 'pglite-server';

const db = new PGlite('./pgdata');
const server = createServer(db);

server.listen(5432, () => {
  console.log('PGlite PostgreSQL server listening on port 5432');
});
