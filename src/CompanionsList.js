import UserCardSent from "./UserCardComponent";

const CompanionsList = ({ companions }) => {
  return (
    <div>
      <div className="companionsList">
        {companions.length > 0 ? (
          companions.map((e, i) => (
            <UserCardSent
              key={i}
              userObject={e}
              onAccept={() => {
                console.log("accept");
              }}
              onReject={null}
            />
          ))
        ) : (
          <div>Cannot find companions based on your availability</div>
        )}
      </div>
    </div>
  );
};

export default CompanionsList;
