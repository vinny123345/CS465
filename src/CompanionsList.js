import React from "react";
import { UserCardSearch, UserCardSent } from "./UserCardComponent";

const CompanionsList = ({ companions, date }) => {
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
                  console.log("accept");
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
