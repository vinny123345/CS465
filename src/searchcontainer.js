import React, { useState } from "react";
import CalendarComponent from "./CalendarComponent";
// import { getUser, updateUser } from "./DBUtils";

export const Searchcontainer = () => {
  const [userSelectedDate, setUserSelectedDate] = useState(null);

  const handleSaveDate = (date) => {
    setUserSelectedDate(date);
    // Extract the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = date.getDay();
    // queryFirebase(dayOfWeek);
  };

  // Function to query the firebase database
  // const queryFirebase = async (dayOfWeek) => {
  //   // Assuming 'entries' is your collection and it has a 'dayOfWeek' field
  //   const snapshot = await firebase
  //     .firestore()
  //     .collection("entries")
  //     .where("dayOfWeek", "==", dayOfWeek)
  //     .get();

  //   if (snapshot.empty) {
  //     console.log("No matching documents.");
  //     return;
  //   }

  //   snapshot.forEach((doc) => {
  //     console.log(doc.id, "=>", doc.data());
  //     // Process your documents here
  //   });
  // };

  return (
    <div style={{ textAlign: "center" }}>
      {userSelectedDate ? (
        <p style={{ fontSize: "16px" }}>
          Your selected date is: {userSelectedDate.toDateString()}
          <br />
          It is a{" "}
          {userSelectedDate.toLocaleDateString("en-US", { weekday: "long" })}
        </p>
      ) : (
        <h1>Choose Your Date</h1>
      )}
      <CalendarComponent onSaveDate={handleSaveDate} />
    </div>
  );
};

export default Searchcontainer;
