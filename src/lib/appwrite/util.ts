import { AppwriteException } from "appwrite";
import { account } from ".";
/**
 * @param [safe=false] - If true, the function will not throw an error if the user is not logged in
 * @description Check if the user is logged in and throw an error if not otherwise return the user
 * @returns user
 */
async function checkIfUserIsLoggedIn(safe = false) {
  try {
    const user = await account.get();
    if (!user) {
      throw new Error("User is not logged in");
    }
    return user;
  } catch (error) {
    if (safe) {
      return null;
    }
    if (error instanceof AppwriteException && error.code === 401) {
      throw new Error("User is not logged in");
    }

    throw error;
  }
}

export { checkIfUserIsLoggedIn };
