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
  get(ref(db, `/users`))
    .then(async (snapshot) => {
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
        console.log("hihiehfiefef start")
        console.log(commonTime)
        console.log("hihiehfiefef end")

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

        // } else {
        //   console.log("No data available for the current user");
        // }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const checkSentRequests = (user, companions) => {
  // check the database to see if the companions list includes the sent requests
  try {
    get(ref(db, `/users`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const netid = user;
          let currUserObj = snapshot.val()[netid];
          if (currUserObj) {
            let sent_requests = currUserObj.sent_requests;
            if (sent_requests) {
              // Iterate through the companions list in reverse order
              for (let j = companions.length - 1; j >= 0; j--) {
                if (sent_requests.includes(companions[j].netid)) {
                  companions.splice(j, 1); // Remove the companion if in sent_requests
                }
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
  return companions; // This might not reflect the updated companions list due to asynchronous operation
};

const findCommonTime = async (userid, companion, dayOfWeek) => {
  // find the common time between the user and the companion
  // return the common time
  // handle the case of every undefined and null
  const user = (await get(ref(db, `/users/${userid}`))).val()
  
  const userAvailability = user.availability;
  const companionAvailability = companion.availability;
  const userStart = userAvailability[dayOfWeek].startTime;
  const userEnd = userAvailability[dayOfWeek].endTime;
  const companionStart = companionAvailability[dayOfWeek].startTime;
  const companionEnd = companionAvailability[dayOfWeek].endTime;
  // handle the case of every undefined and null
  console.log("testing here")
  console.log(userStart)
  console.log(userEnd)
  console.log(companionStart)
  console.log(companionEnd)
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
    console.log(Math.max(new Date(`2020-01-01 ${userStart}`), new Date(`2020-01-01 ${companionStart}`)))
    console.log(typeof(userStart))
    console.log(typeof(companionStart))
    const start1 = new Date(`2020-01-01 ${userStart}`)
    const start2 = new Date(`2020-01-01 ${companionStart}`)
    const end1 = new Date(`2020-01-01 ${userEnd}`)
    const end2 = new Date(`2020-01-01 ${companionEnd}`)
    let startTimeR = companionStart;
    let endTimeR = userEnd;
    
    if (start1 < start2) {
      startTimeR = companionStart;

    } else{
      startTimeR = userStart;
    }

    if (end1 < end2) {
       endTimeR = userEnd;
    } else{
       endTimeR = companionEnd;
    }
      
    return {
      startTime: startTimeR,
      endTime: endTimeR,

    }
    
  }
};

const findCommonLocation = async (userid, companion) => {
  // find the common location between the user and the companion
  // return the common location
  // if no common location, return one of the companion's favorite locations
  const user = (await get(ref(db, `/users/${userid}`))).val()

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

  useEffect(() => {
    const filterCompanions = async () => {
      try {
        const snapshot = await get(ref(db, `/users`));
        if (snapshot.exists()) {
          let currUserObj = snapshot.val()[user];
          if (currUserObj && currUserObj.sent_requests) {
            const sentRequests = currUserObj.sent_requests;
            const updatedCompanions = companions
            // .filter(
            //   // (companion) => !sentRequests.includes(companion.netid)
            // );
            setFilteredCompanions(updatedCompanions);
          } else {
            setFilteredCompanions(companions);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    filterCompanions();
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
                  sendInvitation(
                    user,
                    e,
                    dayOfWeek,
                    await findCommonTime(user, e, dayOfWeek),
                    await findCommonLocation(user, e)
                  );
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
