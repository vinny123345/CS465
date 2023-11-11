import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevSelectedDate, setPrevSelectedDate] = useState(null);
  const [isCalendarVisible, setCalendarVisibility] = useState(false);
  const [isDateSaved, setDateSaved] = useState(false);

  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date >= today) {
      setSelectedDate(date);
    }
  };

  const handleToggleCalendar = () => {
    if (!isDateSaved && prevSelectedDate !== null) {
      setSelectedDate(prevSelectedDate);
    }
    setCalendarVisibility(!isCalendarVisible);
  };

  const handleSaveDate = () => {
    console.log("Selected Date:", selectedDate);

    setPrevSelectedDate(selectedDate);
    setDateSaved(true);
    setCalendarVisibility(false);
  };

  const tileDisabled = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      view === "month" &&
      date < today &&
      date.toDateString() !== (selectedDate?.toDateString() ?? "")
    );
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isDateSaved && (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          <h2>
            Selected Date:{" "}
            {prevSelectedDate ? prevSelectedDate.toDateString() : ""}
          </h2>
        </div>
      )}
      <button onClick={handleToggleCalendar}>
        {isCalendarVisible ? "Cancel" : "Choose a Date"}
      </button>

      {isCalendarVisible && (
        <div style={{ position: "relative" }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={tileDisabled}
            defaultValue={new Date()}
          />
          <button onClick={handleSaveDate} style={{ marginTop: "10px" }}>
            Save Date
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
