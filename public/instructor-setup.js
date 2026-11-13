import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
let currentUser = null;
$('signin').onclick = async () => {
  try { const result = await signInWithPopup(auth, new GoogleAuthProvider()); currentUser = result.user; }
  catch (e) { $('status').textContent = 'Sign-in failed: ' + e.message; }
};
$('signout').onclick = async () => { await signOut(auth); currentUser = null; };
$('request').onclick = async () => {
  if (!currentUser) return;
  $('request').disabled = true;
  try {
    const ref = doc(db, 'instructorRequests', currentUser.uid);
    const existing = await getDoc(ref);
    if (existing.exists() && existing.data().status === 'approved') {
      $('status').textContent = 'This account is already approved. Sign out and return to the administrator page.';
      return;
    }
    await setDoc(ref, {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || '',
      reason: $('reason').value.trim().slice(0, 500),
      status: 'pending',
      requestedAt: serverTimestamp()
    });
    $('status').textContent = 'Request submitted. An existing administrator must review and approve it.';
  } catch (e) { $('status').textContent = 'Could not submit request: ' + e.message; }
  finally { $('request').disabled = !currentUser; }
};
onAuthStateChanged(auth, user => {
  currentUser = user;
  $('identity').textContent = user ? `Signed in as ${user.email || user.uid}` : 'Not signed in.';
  $('signin').disabled = !!user;
  $('signout').disabled = !user;
  $('request').disabled = !user;
});
