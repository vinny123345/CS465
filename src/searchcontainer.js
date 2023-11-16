import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUser,
  getCompanionsWithDate,
  filterTime,
  filterLocation,
} from "./DBUtils";
import CalendarComponent from "./CalendarComponent";
import CompanionsList from "./CompanionsList"; // new component for listing companions

export const Searchcontainer = () => {
  const { user } = useParams();
  const [userData, setUserData] = useState();
  const [userSelectedDate, setUserSelectedDate] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [originalCompanions, setOriginalCompanions] = useState([]);
  const [isTimeFilterApplied, setIsTimeFilterApplied] = useState(false);
  const [isLocationFilterApplied, setIsLocationFilterApplied] = useState(false);
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
    try {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      setUserSelectedDate(date); // Assuming date is a Date object
      const companionsList = await getCompanionsWithDate(
        dayOfWeek,
        userData.netid
      );
      setCompanions(companionsList);
      setOriginalCompanions(companionsList); // Set original companions here
    } catch (error) {
      console.error("Error fetching companions:", error);
    }
  };

  const toggleTimeFilter = async () => {
    setIsTimeFilterApplied(!isTimeFilterApplied);
    if (!isTimeFilterApplied) {
      // Apply time filter
      const filteredCompanions = await filterTime(
        userData.netid,
        companions,
        userSelectedDate.toLocaleDateString("en-US", { weekday: "long" })
      );
      setCompanions(filteredCompanions);
    } else {
      // Revert to original companions list
      setCompanions(originalCompanions);
    }
  };

  const toggleLocationFilter = async () => {
    setIsLocationFilterApplied(!isLocationFilterApplied);
    if (!isLocationFilterApplied) {
      // Apply location filter
      const filteredCompanions = await filterLocation(
        userData.netid,
        companions
      );
      setCompanions(filteredCompanions);
    } else {
      // Revert to original companions list
      setCompanions(originalCompanions);
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
          <button
            onClick={() => toggleTimeFilter()}
            style={{ marginTop: "10px" }}
          >
            Time Filter
          </button>
          <button
            onClick={() => toggleLocationFilter()}
            style={{ marginTop: "10px" }}
          >
            Location Filter
          </button>
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
