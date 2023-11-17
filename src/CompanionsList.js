import React from "react";
import { UserCardSearch, UserCardSent } from "./UserCardComponent";
import { ref, get, set } from "firebase/database";
import { db } from "./DBUtils";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// const sendInvitation = (user, companion) => {
//   console.log("send invitation");
// };

const { v4: uuidv4 } = require("uuid");

const generateUniqueKey = () => {
  // Use the uuid library to generate a unique key
  return uuidv4();
};

const sendInvitation = async (
  user,
  companion,
  dayOfWeek,
  commonTime,
  commonLocation
) => {
  try {
    const snapshot = await get(ref(db, `/users`));
    if (snapshot.exists()) {
      console.log(snapshot.val());
      console.log(user);

      const currnetid = user;
      const effectednetid = companion.netid;

      // current user: append to send requests

      let currUserObj = snapshot.val()[currnetid];
      //if (currUserObj) {
      // Generate a unique key for the new request
      const newRequestId = generateUniqueKey();
      console.log("hihiehfiefef start");
      console.log(commonTime);
      console.log("hihiehfiefef end");

      // Create an object with the new request using the unique key
      const newRequest = {
        requestId: newRequestId,
        netid: effectednetid,
        time: commonTime,
        date: dayOfWeek,
        location: commonLocation,
        // Other properties of the request...
      };
      console.log(newRequest);
      // TODO: get the current sent_reuquests
      // TODO: push the newRquest object into the requests

      // Update the requests object in the database
      //await set(ref(db, "users/" + netid), userData);
      await set(
        ref(db, `/users/${currnetid}/sent_requests/` + newRequestId),
        newRequest
      );

      // } else {
      //   console.log("No data available for the current user");
      // }

      // effected user: append to received requests

      let effUserObj = snapshot.val()[effectednetid];
      //if (effUserObj) {
      // Use the same key for the new request

      // Create an object with the new request using the unique key
      const anotherRequest = {
        requestId: newRequestId,
        netid: currnetid,
        time: commonTime,
        date: dayOfWeek,
        location: commonLocation,
        // Other properties of the request...
      };
      // TODO: get the current sent_reuquests
      // TODO: push the newRquest object into the requests

      // Update the requests object in the database
      //await set(ref(db, "users/" + netid), userData);
      await set(
        ref(db, `/users/${effectednetid}/received_requests/` + newRequestId),
        anotherRequest
      );
      return Promise.resolve();
    } else {
      console.log("No data available");
      return Promise.reject(new Error("No data available"));
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const checkSentRequests = (sentRequests, companions) => {
  // check if the companions list includes the already sent requests
  // return the companions list without the already sent requests
  // if no sent requests, return the companions list
  if (sentRequests === null || sentRequests === undefined) {
    return companions;
  }
  if (companions === null || companions === undefined) {
    return companions;
  }
  if (sentRequests.length === 0) {
    return companions;
  }
  if (companions.length === 0) {
    return companions;
  }
  // iterate through the sent requests
  for (const i in sentRequests) {
    console.log(sentRequests[i]);
    // filter the companions list based on the date and start time and end time
    // if the netId, date, start time and end time are the same, remove the companion from the list
    // Very initial implementation, need to be improved
    companions = companions.filter(
      (companion) =>
        companion.netid !== sentRequests[i].netid ||
        companion.availability[sentRequests[i].date].startTime !==
          sentRequests[i].time.startTime ||
        companion.availability[sentRequests[i].date].endTime !==
          sentRequests[i].time.endTime
    );
  }
  return companions;
};

const findCommonTime = async (userid, companion, dayOfWeek) => {
  // find the common time between the user and the companion
  // return the common time
  // handle the case of every undefined and null
  const user = (await get(ref(db, `/users/${userid}`))).val();

  const userAvailability = user.availability;
  const companionAvailability = companion.availability;
  const userStart = userAvailability[dayOfWeek].startTime;
  const userEnd = userAvailability[dayOfWeek].endTime;
  const companionStart = companionAvailability[dayOfWeek].startTime;
  const companionEnd = companionAvailability[dayOfWeek].endTime;
  // handle the case of every undefined and null
  console.log("testing here");
  console.log(userStart);
  console.log(userEnd);
  console.log(companionStart);
  console.log(companionEnd);
  if (
    userStart === null ||
    userStart === undefined ||
    userEnd === null ||
    userEnd === undefined
  ) {
    return {
      startTime: companionStart,
      endTime: companionEnd,
    };
  }
  if (
    companionStart === null ||
    companionStart === undefined ||
    companionEnd === null ||
    companionEnd === undefined
  ) {
    return {
      startTime: userStart,
      endTime: userEnd,
    };
  }
  if (companionStart >= userEnd || companionEnd <= userStart) {
    return {
      startTime: companionStart,
      endTime: companionEnd,
    };
  } else {
    console.log(
      Math.max(
        new Date(`2020-01-01 ${userStart}`),
        new Date(`2020-01-01 ${companionStart}`)
      )
    );
    console.log(typeof userStart);
    console.log(typeof companionStart);
    const start1 = new Date(`2020-01-01 ${userStart}`);
    const start2 = new Date(`2020-01-01 ${companionStart}`);
    const end1 = new Date(`2020-01-01 ${userEnd}`);
    const end2 = new Date(`2020-01-01 ${companionEnd}`);
    let startTimeR = companionStart;
    let endTimeR = userEnd;

    if (start1 < start2) {
      startTimeR = companionStart;
    } else {
      startTimeR = userStart;
    }

    if (end1 < end2) {
      endTimeR = userEnd;
    } else {
      endTimeR = companionEnd;
    }

    return {
      startTime: startTimeR,
      endTime: endTimeR,
    };
  }
};

const findCommonLocation = async (userid, companion) => {
  // find the common location between the user and the companion
  // return the common location
  // if no common location, return one of the companion's favorite locations
  const user = (await get(ref(db, `/users/${userid}`))).val();

  const userLocations = user.fav_locations;
  const companionLocations = companion.fav_locations;
  // handle the case of every undefined and null
  if (userLocations === null || userLocations === undefined) {
    return companionLocations[0];
  }
  if (companionLocations === null || companionLocations === undefined) {
    return userLocations[0];
  }
  if (userLocations.length === 0) {
    return companionLocations[0];
  }
  if (companionLocations.length === 0) {
    return userLocations[0];
  }
  for (let i = 0; i < userLocations.length; i++) {
    if (companionLocations.includes(userLocations[i])) {
      return userLocations[i];
    }
  }
};

const CompanionsList = ({ companions, date }) => {
  const { user } = useParams();
  const [filteredCompanions, setFilteredCompanions] = useState([]);

  const updateCompanionsList = async () => {
    try {
      const snapshot = await get(ref(db, `/users`));
      if (snapshot.exists()) {
        let currUserObj = snapshot.val()[user];
        if (currUserObj && currUserObj.sent_requests) {
          const updatedCompanions = checkSentRequests(
            currUserObj.sent_requests,
            companions
          );
          setFilteredCompanions(updatedCompanions);
        } else {
          setFilteredCompanions(companions);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    updateCompanionsList();
  }, [companions, user]);

  return (
    <div>
      <div className="companionsList">
        {filteredCompanions && filteredCompanions.length > 0 ? (
          filteredCompanions.map((e, i) => {
            // Calculate dayOfWeek for each iteration
            const dayOfWeek = date
              ? date.toLocaleDateString("en-US", { weekday: "long" })
              : "";
            return (
              <UserCardSearch
                key={i}
                userObject={e}
                onAccept={async () => {
                  await sendInvitation(
                    user,
                    e,
                    dayOfWeek,
                    await findCommonTime(user, e, dayOfWeek),
                    await findCommonLocation(user, e)
                  );
                  await updateCompanionsList(); // Update the companions list after sending an invitation
                }}
                onReject={null}
                dayOfWeek={dayOfWeek}
              />
            );
          })
        ) : (
          <div>Cannot find companions based on your availability</div>
        )}
      </div>
    </div>
  );
};

export default CompanionsList;
