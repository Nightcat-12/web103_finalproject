import { getFirebaseAdminAuth } from '../config/firebaseAdmin.js'

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || ''

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Bearer token' })
    }

    const idToken = authHeader.slice('Bearer '.length).trim()
    if (!idToken) {
      return res.status(401).json({ error: 'Missing Firebase ID token' })
    }

    const adminAuth = getFirebaseAdminAuth()
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    req.authUid = decodedToken.uid

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Firebase ID token' })
  }
}

export default verifyFirebaseToken
