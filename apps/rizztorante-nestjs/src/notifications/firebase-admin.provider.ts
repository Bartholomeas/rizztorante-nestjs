import * as firebaseAdmin from "firebase-admin";

export const FirebaseAdminProvider = {
  provide: "FIREBASE_ADMIN",
  useFactory: () => {
    const defaultApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    return { defaultApp };
  },
};
