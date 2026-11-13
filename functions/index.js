const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
initializeApp();
exports.reviewInstructorRequest = onCall(async (request) => {
  if (!request.auth || request.auth.token.labAdmin !== true) {
    throw new HttpsError("permission-denied", "Only a verified project administrator can review instructor requests.");
  }
  const uid = typeof request.data?.uid === "string" ? request.data.uid : "";
  const approve = request.data?.approve;
  if (!uid || uid === request.auth.uid || typeof approve !== "boolean") {
    throw new HttpsError("invalid-argument", "Provide a valid instructor UID and approve boolean. Administrators cannot approve themselves through this queue.");
  }
  const db = getFirestore();
  const ref = db.collection("instructorRequests").doc(uid);
  const snap = await ref.get();
  if (!snap.exists || snap.data().status !== "pending") {
    throw new HttpsError("not-found", "No pending request was found for that user.");
  }
  const target = await getAuth().getUser(uid);
  if (approve) {
    await getAuth().setCustomUserClaims(uid, { ...(target.customClaims || {}), labAdmin: true });
    await ref.update({ status: "approved", reviewedAt: FieldValue.serverTimestamp(), reviewedBy: request.auth.uid });
    return { status: "approved", email: target.email || "" };
  }
  await ref.update({ status: "rejected", reviewedAt: FieldValue.serverTimestamp(), reviewedBy: request.auth.uid });
  return { status: "rejected", email: target.email || "" };
});
