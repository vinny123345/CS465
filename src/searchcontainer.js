import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUser, getCompanionsWithDate } from "./DBUtils";
import CalendarComponent from "./CalendarComponent";
import CompanionsList from "./CompanionsList"; // new component for listing companions

export const Searchcontainer = () => {
  const { user } = useParams();
  const [userData, setUserData] = useState({
    /* ... initial state ... */
  });
  const [userSelectedDate, setUserSelectedDate] = useState(null);
  const [companions, setCompanions] = useState([]);

  // Fetch user data on component mount or when 'user' changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser(user);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveDate = async (date) => {
    setUserSelectedDate(date);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    try {
      const companionsList = await getCompanionsWithDate(
        dayOfWeek,
        userData.netid
      );
      setCompanions(companionsList);
    } catch (error) {
      console.error("Error fetching companions:", error);
    }
  };

  return (
    <div style={styles.container}>
      {userSelectedDate ? (
        <>
          <p style={styles.selectedDate}>
            Your selected date is: {userSelectedDate.toDateString()}
            <br />
            It is a{" "}
            {userSelectedDate.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <CalendarComponent onSaveDate={handleSaveDate} />
          <CompanionsList companions={companions} />
        </>
      ) : (
        <>
          <h1>Choose Your Date</h1>
          <CalendarComponent onSaveDate={handleSaveDate} />
        </>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center" },
  selectedDate: { fontSize: "16px" },
  // Add more styles as needed
};

export default Searchcontainer;
