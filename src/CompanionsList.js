import React from "react";
import { UserCardSearch, UserCardSent } from "./UserCardComponent";
import {
  ref,
  get,
  set
  
} from "firebase/database";
import { db } from "./DBUtils";
import { useParams } from "react-router-dom";

// const sendInvitation = (user, companion) => {
//   console.log("send invitation");
// };

const { v4: uuidv4 } = require('uuid');

const generateUniqueKey = () => {
  // Use the uuid library to generate a unique key
  return uuidv4();
};

const sendInvitation = async (user, companion) => {

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
    
            // Create an object with the new request using the unique key
            const newRequest = {
                requestId: newRequestId,
                netid: effectednetid,
                time: "",
                date: "",
                location: ""
                // Other properties of the request...
            };
            console.log(newRequest);
            // TODO: get the current sent_reuquests
            // TODO: push the newRquest object into the requests
    
            // Update the requests object in the database
            //await set(ref(db, "users/" + netid), userData);
            await set(ref(db, `/users/${currnetid}/sent_requests/` + newRequestId), newRequest);
            


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
                time: "",
                date: "",
                location: ""
                // Other properties of the request...
            };
            // TODO: get the current sent_reuquests
            // TODO: push the newRquest object into the requests
    
            // Update the requests object in the database
            //await set(ref(db, "users/" + netid), userData);
            await set(ref(db, `/users/${effectednetid}/received_requests/` + newRequestId), anotherRequest);


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

const CompanionsList = ({ companions, date }) => {
  const { user } = useParams();
  console.log(user);
  return (
    <div>
      <div className="companionsList">
        {companions && companions.length > 0 ? (
          companions.map((e, i) => {
            // Calculate dayOfWeek for each iteration
            const dayOfWeek = date
              ? date.toLocaleDateString("en-US", { weekday: "long" })
              : "";
            return (
              <UserCardSearch
                key={i}
                userObject={e}
                onAccept={() => {
                  sendInvitation(user, e);
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
