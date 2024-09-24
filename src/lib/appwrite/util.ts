import { AppwriteException, Models } from "appwrite";
import { account } from ".";
/**
 *
 * @description Check if the user is logged in and throw an error if not otherwise return the user
 * @returns user
 */
async function checkIfUserIsLoggedIn() {
  let user;
  try {
    user = await account.get();
    if (!user?.$id) {
      throw new Error("User is not logged in");
    }
    // store user in local storage
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (error instanceof AppwriteException) {
      switch (error.message) {
        case "Failed to fetch": {
          const localUser: Models.User<Models.Preferences> = JSON.parse(
            localStorage.getItem("user") ?? "{}"
          );
          if (!localUser) {
            throw new Error("User is not logged in");
          }
          return localUser;
        }
        default:
          throw new Error("User is not logged in");
      }
    }
    throw new Error("User is not logged in");
  }
}

export { checkIfUserIsLoggedIn };
