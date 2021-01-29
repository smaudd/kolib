export async function verifyUsername({ username }) {
  try {
    const usernamesRef = this.$fire.firestore.collection("usernames");
    const snapshot = await usernamesRef
      .where("username", "==", username)
      .get();
    if (snapshot.empty) {
      return true;
    }
    throw this.$t("UNIQUE_USERNAME");
  } catch (err) {
    console.log('hay error!!')
    throw err;
  }
}
export async function saveUsername({ username, uid }) {
  const usernamesRef = this.$fire.firestore.collection("usernames");
  try {
    await usernamesRef.add({
      username,
      uid,
    });
  } catch (err) {
    throw err;
  }
}