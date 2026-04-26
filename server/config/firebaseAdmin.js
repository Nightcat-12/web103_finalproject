import admin from 'firebase-admin'

let appInstance = null

const parseServiceAccountFromEnv = () => {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (!rawJson) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable')
  }

  let serviceAccount
  try {
    serviceAccount = JSON.parse(rawJson)
  } catch (err) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON')
  }

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
  }

  return serviceAccount
}

const getFirebaseAdminApp = () => {
  if (appInstance) return appInstance

  const serviceAccount = parseServiceAccountFromEnv()

  appInstance = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  return appInstance
}

export const getFirebaseAdminAuth = () => {
  const app = getFirebaseAdminApp()
  return admin.auth(app)
}
