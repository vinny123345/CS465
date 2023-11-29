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
import "./searchcontainer.css";

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

  const resetFilters = () => {
    setIsTimeFilterApplied(false);
    setIsLocationFilterApplied(false);
  };

  const applyFilters = async () => {
    // Performing a deep copy of originalCompanions
    let filteredCompanions = originalCompanions.map((comp) => ({ ...comp }));
    if (isTimeFilterApplied) {
      filteredCompanions = await filterTime(
        userData.netid,
        filteredCompanions,
        userSelectedDate.toLocaleDateString("en-US", { weekday: "long" })
      );
    }

    if (isLocationFilterApplied) {
      filteredCompanions = await filterLocation(
        userData.netid,
        filteredCompanions
      );
    }

    setCompanions(filteredCompanions);
  };

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
      resetFilters();
    } catch (error) {
      console.error("Error fetching companions:", error);
    }
  };

  useEffect(() => {
    if (originalCompanions.length > 0) {
      applyFilters();
    }
  }, [isTimeFilterApplied, isLocationFilterApplied, originalCompanions]);

  const handleTimeFilterChange = (event) => {
    setIsTimeFilterApplied(event.target.checked);
  };

  const handleLocationFilterChange = (event) => {
    setIsLocationFilterApplied(event.target.checked);
  };

  return (
    <div className = "searchpage">
      <div className="search-page-window">
        {userSelectedDate ? (
          <>
            <p>Your selected date is: {userSelectedDate.toDateString()}</p>
            <CalendarComponent onSaveDate={handleSaveDate} />
            <label>
              <input
                type="checkbox"
                checked={isTimeFilterApplied}
                onChange={handleTimeFilterChange}
              />
              Time Filter
            </label>
            <label>
              <input
                type="checkbox"
                checked={isLocationFilterApplied}
                onChange={handleLocationFilterChange}
              />
              Location Filter
            </label>
            <CompanionsList companions={companions} date={userSelectedDate} />
          </>
        ) : (
          <>
            <h1>Choose Your Date</h1>
            <CalendarComponent onSaveDate={handleSaveDate} />
          </>
        )}
      </div>
    </div>
  );
};

export default Searchcontainer;
