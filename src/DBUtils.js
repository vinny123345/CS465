import { type } from "@testing-library/user-event/dist/type";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  set,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB6OMDiGIuzU0o-is8CLn_yAqIdiORk-vc",
  authDomain: "ieatcs465.firebaseapp.com",
  databaseURL: "https://ieatcs465-default-rtdb.firebaseio.com",
  projectId: "ieatcs465",
  storageBucket: "ieatcs465.appspot.com",
  messagingSenderId: "86450940860",
  appId: "1:86450940860:web:8b798a96c3292a626d19b9",
  measurementId: "G-WC6BY9CG6S",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };

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

      // Update the user's data in the database
      await update(userRef, updatedUserAttributes);
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

export async function getSelfAvailability(netid) {
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
          return user["availability"];
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

export async function getCompanionsWithDate(day, netId) {
  // Get all the potential companions based on the day of the week selected by the user and return them
  try {
    // Iterate through the users to find all with the matching netid
    const usersRef = ref(db, `/users`);
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      // Extract and return the user data
      const usersData = snapshot.val();
      // Iterate through the users to find the one with the matching netid
      const selfAvailability = await getSelfAvailability(netId);
      if (selfAvailability === null) {
        return null;
      }
      if (selfAvailability[day] === undefined) {
        return null;
      }
      return matchTime(netId, selfAvailability, usersData, day);
    }
  } catch (error) {
    // Handle any potential errors
    console.error("Error fetching companions:", error);
    throw error;
  }
}

export async function matchTime(netId, selfAvailability, usersData, day) {
  const companions = [];
  const selfStart = selfAvailability[day].startTime;
  const selfEnd = selfAvailability[day].endTime;
  for (const userId in usersData) {
    const user = usersData[userId];
    if (user.netid !== netId) {
      const companionAvailability = user.availability;
      if (
        companionAvailability === null ||
        companionAvailability === undefined
      ) {
        continue;
      }
      if (
        companionAvailability[day] === null ||
        companionAvailability[day] === undefined
      ) {
        continue;
      } else {
        const companionStart = companionAvailability[day].start;
        const companionEnd = companionAvailability[day].end;
        //check if the time overlaps
        if (selfStart >= companionEnd || selfEnd <= companionStart) {
          continue;
        } else {
          companions.push(user);
        }
      }
    }
  }
  return companions;
}



export async function addUser(netid, userData) {
  try {
    await set(ref(db, 'users/' + netid), userData);
    console.log("success");
  } catch (error) {
    // Handle any potential errors
    console.error("Error adding user:", error);
    throw error;
  }
}

export function getNetId(userObj) {
  try {
    if(userObj)
    {
      const netid = userObj.email.split('@')[0];
      return netid;
    }

    return "";

  } catch (error) {
    // Handle any potential errors
    console.error("Error getting netid:", error);
    return "";
  }
}

export function getEmail(netid) {
  const email = `${netid}@illinois.edu`;
  return email;
}
