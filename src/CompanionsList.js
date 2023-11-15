// CompanionsList component in CompanionsList.js
const CompanionsList = ({ companions }) => {
  return (
    <div>
      {companions.map((companion, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <p>
            <strong>First Name:</strong> {companion.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {companion.last_name}
          </p>
          <p>
            <strong>NetID:</strong> {companion.netid}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CompanionsList;
