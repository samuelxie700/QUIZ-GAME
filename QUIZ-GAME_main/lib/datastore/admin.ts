// lib/datastore/admin.ts
import { Datastore } from '@google-cloud/datastore';

type SA = { project_id?: string; client_email?: string; private_key?: string };

function getSa(): Required<SA> {
  const raw = process.env.FB_SERVICE_ACCOUNT_JSON ?? '';
  if (!raw.trim().startsWith('{')) {
    throw new Error('FB_SERVICE_ACCOUNT_JSON must contain the service account JSON for Datastore.');
  }
  const sa = JSON.parse(raw) as SA;
  const project_id = sa.project_id!;
  const client_email = sa.client_email!;
  const private_key = (sa.private_key || '').replace(/\\n/g, '\n');
  if (!project_id || !client_email || !private_key) {
    throw new Error('Service account JSON missing project_id, client_email, or private_key.');
  }
  return { project_id, client_email, private_key };
}

const sa = getSa();

// This avoids reading .proto files at runtime
export const datastore = new Datastore({
  projectId: sa.project_id,
  credentials: {
    client_email: sa.client_email,
    private_key: sa.private_key,
  },
  fallback: true, // <— key line
});
