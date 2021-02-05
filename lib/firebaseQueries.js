import * as firebase from 'firebase';
export async function verifyUsername({ username }) {
  try {
    const usersRef = this.$fire.firestore.collection("users");
    const snapshot = await usersRef
      .where("username", "==", username)
      .get();
    if (snapshot.empty) {
      return true;
    }
    throw this.$t("UNIQUE_USERNAME");
  } catch (err) {
    throw err;
  }
}
export async function saveUsername({ username, uid, email }) {
  const userRef = this.$fire.firestore.collection("users").doc(uid);
  try {
    await userRef.set({
      username,
      email,
      uid,
    }, { merge: true });
  } catch (err) {
    throw err;
  }
}
export async function updateUsername({ username, uid, email }) {
  const kitsRef = this.$fire.firestore
    .collection('kits')
    .where('ownerUid', "==", uid)
  const batch = this.$fire.firestore.batch()
  const snapshot = await kitsRef.get()
  for (let doc of snapshot.docs) {
    batch.update(doc.ref, { ownerUsername: username })
  }
  await batch.commit()
}
export async function setKit({ kitData }) {
  const kitsRef = this.$fire.firestore
    .collection('kits')
    .doc(kitData.name);
  try {
    const res = await kitsRef.set({
      ...kitData,
      ownerUid: this.$store.state.user.uid,
      ownerUsername: this.$store.state.user.displayName,
      date: this.$fireModule.firestore.Timestamp.now()
    });
    console.log(res)
    return true;
  } catch (err) {
    throw err;
  }
}
export async function getKits({ filters }) {
  const kitsRef = this.$fire.firestore
    .collection('kits')
    .limit(10)
    const snapshot = await kitsRef.get()
    return snapshot.docs.map((doc) => doc.data())
}