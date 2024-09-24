import { account } from ".";
/**
 *
 * @description Check if the user is logged in and throw an error if not otherwise return the user
 * @returns user
 */
async function checkIfUserIsLoggedIn() {
  let user;
  let session;
  try {
    user = await account.get();
    if (!user?.$id) {
      throw new Error("User is not logged in");
    }
    session = await account.getSession("current");
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("session", JSON.stringify(session));
  } catch (error) {
    if (window.navigator.onLine) {
      console.log(error);
      throw new Error("User is not logged in");
    }
    user = JSON.parse(window.localStorage.getItem("user") ?? "{}");
    if (!user.$id) {
      throw new Error("User is not logged in");
    }
    session = JSON.parse(window.localStorage.getItem("session") ?? "{}");
  }
  return user;
}

export { checkIfUserIsLoggedIn };
