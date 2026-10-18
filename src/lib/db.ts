import { getDatabase } from '@netlify/database';
import { Repository, type Queryable } from './repository';
let repository: Repository | undefined;
export function getRepository() {
  if (!repository) {
    const connectionString = process.env.NETLIFY_DB_URL || process.env.DATABASE_URL;
    const db = connectionString ? getDatabase({ connectionString }) : getDatabase();
    repository = new Repository(db.pool as Queryable);
  }
  return repository;
}
