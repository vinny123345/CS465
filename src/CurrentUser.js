import { db } from './DBUtils'; 
import { ref, query, orderByChild, equalTo, get, set } from "firebase/database";

export async function getUser(netid) {
  // TODO: 
  // now you need put params in the url like 
  // http://localhost:3000/profile/jones1 
  // jones1 is just the netid
  try {
    // Use the 'db' to query the database and fetch user data based on the 'netId'
    const userRef = ref(db, `/users`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // Extract and return the user data
      const usersData = snapshot.val();
      // Iterate through the users to find the one with the matching netid
      for (const userId in usersData) {
        const user = usersData[userId];
        if (user.netid === netid) {
          console.log(user);
          return user; 
        }
      }
    } else {
      // Handle the case when the user doesn't exist
      return null;
    }
  } catch (error) {
    // Handle any potential errors
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function updateUser(netid, updatedUserAttributes) {
  try {
    // Implement the logic to update user attributes in the database
    // You should use 'ref', 'set', 'update', or other relevant Firebase methods here
    // Remember to handle any errors that may occur during the update process
    // Create a reference to the user's data in the Firebase database
    const usersRef = ref(db, `/users`);
    const userQuery = query(usersRef, orderByChild("netid"), equalTo(netid));

    const snapshot = await get(userQuery);


    // TODO:
    // find the user with the netid
    // updathe the user in db

    // const user = snapshot.val();

    // const updatedUser = { ...user, ...updatedUserAttributes };

    //   // Update the user's data in the database
    // await update(userRef, updatedUser);

    // return updatedUser;


    if (snapshot.exists()) {
      // Extract and return the user data
      const id = Object.keys(snapshot.val())[0];

      // Create a reference to the specific user by their netid
      const userRef = ref(db, `users/${id}`);
      console.log(id);

      // Update the user's data in the database
      await set(userRef, updatedUserAttributes);
      // Iterate through the users to find the one with the matching netid
      
    } else {
      // Handle the case when the user doesn't exist
      return null;
    }
  } catch (error) {
    // Handle any potential errors
    console.error("Error updating user:", error);
    throw error;
  }
}