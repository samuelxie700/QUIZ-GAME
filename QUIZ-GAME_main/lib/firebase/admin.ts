// lib/firebase/admin.ts
import { getApps, getApp, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccountLike = {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
};

function resolveServiceAccount(): ServiceAccountLike {
  const json = process.env.FB_SERVICE_ACCOUNT_JSON;
  if (json && json.trim().startsWith('{')) {
    const parsed = JSON.parse(json) as ServiceAccountLike;
    const pk = parsed.private_key ?? parsed.privateKey ?? '';
    if (pk) parsed.private_key = pk.replace(/\\n/g, '\n');
    return parsed;
  }

  const projectId = process.env.FB_PROJECT_ID;
  const clientEmail = process.env.FB_CLIENT_EMAIL;
  let privateKey = process.env.FB_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin env. Provide FB_SERVICE_ACCOUNT_JSON OR FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY.'
    );
  }

  privateKey = privateKey.replace(/\\n/g, '\n');
  return { project_id: projectId, client_email: clientEmail, private_key: privateKey };
}

function toCert(sa: ServiceAccountLike) {
  const projectId = sa.projectId ?? sa.project_id;
  const clientEmail = sa.clientEmail ?? sa.client_email;
  const privateKey = sa.privateKey ?? sa.private_key;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Service account must contain projectId, clientEmail, privateKey.');
  }
  return { projectId, clientEmail, privateKey };
}

// App init (pin projectId)
const sa = resolveServiceAccount();
const app: App =
  getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(toCert(sa)),
        projectId: sa.projectId ?? sa.project_id,
      });

// Database id handling 
// Accept these cases for the "default" database:
//  • FB_DB_ID unset  -> use implicit default (omit id)
//  • FB_DB_ID="(default)" -> implicit default (omit id)
//  • FB_DB_ID="default"   -> *explicit* default (pass "default")
// Also ignore accidental projectId values.
function resolveDbId(projectId?: string): string | null {
  let raw = process.env.FB_DB_ID ?? '';
  raw = raw.trim().replace(/^"+|"+$/g, ''); // strip surrounding quotes

  if (!raw) return null; // implicit default
  const lower = raw.toLowerCase();

  if (lower === '(default)') return null;         // implicit default
  if (lower === 'default') return 'default';      // explicit default (some stacks require this)
  if (projectId && raw === projectId) {

    console.warn(
      `[Firestore Admin] FB_DB_ID is set to the projectId "${projectId}". ` +
        'That is not a databaseId; using the default database instead.'
    );
    return null;
  }
  return raw; // real named DB (e.g., "prod", "staging")
}

const dbId = resolveDbId(sa.projectId ?? sa.project_id);
const adminDb = dbId ? getFirestore(app, dbId) : getFirestore(app);

// Debug log
type MinimalSA = { project_id?: string; projectId?: string };

(function debugLogFirestoreEnv() {
  const rawSa = process.env.FB_SERVICE_ACCOUNT_JSON ?? '';
  let project = sa.projectId ?? sa.project_id ?? '(unknown)';
  if (!project && rawSa.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawSa) as MinimalSA;
      project = parsed.project_id ?? parsed.projectId ?? project;
    } catch {
      /* ignore */
    }
  }
  const rawDbId = process.env.FB_DB_ID ?? '(unset → default)';
  const emulator = process.env.FIRESTORE_EMULATOR_HOST ?? '(none)';
  // eslint-disable-next-line no-console
  console.log(
    '[Firestore Admin]',
    'project:', project,
    'dbIdRaw:', JSON.stringify(rawDbId),
    'dbIdEffective:', dbId ?? '(implicit default)',
    'emulator:', emulator
  );
})();

export { adminDb };
