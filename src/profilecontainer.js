import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser, updateUser, getNetId } from "./DBUtils";
import "./ProfileContainer.css";
import { Button, Modal, Nav, Tab, ListGroup, Form, ButtonGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useUserLoggedIn } from "./UserLoggedIn";

export const Profilecontainer = () => {
  // NEW: get the netid
  const { userObj, isLoading } = useUserLoggedIn();
  //const user = getNetId(userObj);
  var { user } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [initialAvailabilityView, setInitialAvailabilityView] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleLocationButtonClick = () => setShowLocationModal(true);

  const handleCloseAvailabilityModal = () => setShowAvailabilityModal(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [fav_locations, setFav_locations] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");

  const [error, setError] = useState({});

  const [viewMode, setViewMode] = useState("availability");

  // Validation function
  const validate = () => {
    let newErrors = {};
    if (userData.first_name === "firstname")
      newErrors.first_name = "First name is required";
    if (!userData.last_name === "lastname")
      newErrors.last_name = "Last name is required";
    // if (!userData.grade) newErrors.grade = 'Grade is required';
    if (userData.gender === "gender") newErrors.gender = "Gender is required";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser(user);
        console.log(user);
        console.log(data);
        setUserData(data);
        console.log(userData);
        if (data.first_name === "firstname") {
          setIsEditing(true);
        }
        if (data.availability) {
          const days = Object.keys(data.availability);
          const selectedDay = days.length > 0 ? days[0] : null;

          const { startTime, endTime } = data.availability[selectedDay] || {};
          setSelectedDay(selectedDay || null);
          setStartTime(startTime || null);
          setEndTime(endTime || null);
        } else {
          // Reset the selected day, start time, and end time
          setSelectedDay(null);
          setStartTime(null);
          setEndTime(null);
        }

        if (data.fav_locations) {
          setFav_locations(data.fav_locations);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (mode) => {
    setViewMode(mode);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!validate()) {
      // If validation fails, stop the function
      return;
    }

    try {
      await updateUser(user, userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    console.log("here");
    // Assuming you're sending the image to the backend as a Base64 string
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      setUserData({ ...userData, profile_pic: fileReader.result });
    };
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleAvailabilityButtonClick = async () => {
    setShowAvailabilityModal(true);
    setInitialAvailabilityView(true);
    // Set selected day, start time, and end time to current values from user data
    setUserData(await getUser(user));
    setSelectedDay(
      userData.availability ? Object.keys(userData.availability)[0] : null
    );
    setStartTime(
      userData.availability
        ? userData.availability[selectedDay]?.startTime || null
        : null
    );
    setEndTime(
      userData.availability
        ? userData.availability[selectedDay]?.endTime || null
        : null
    );
  };

  const handleSaveAvailability = async () => {
    try {
      var latestUserData = await getUser(user);
      if (selectedDay && startTime !== null && endTime !== null) {
        // Clone the existing availability object or create a new one if it doesn't exist
        const existingAvailability = userData.availability
          ? { ...userData.availability }
          : {};

        // Update the selected day with the new availability
        existingAvailability[selectedDay] = {
          startTime: startTime,
          endTime: endTime,
        };

        // Update user data with the modified availability
        const updatedUserData = {
          ...userData,
          availability: existingAvailability,
        };

        await updateUser(user, updatedUserData);

        // Fetch updated user data immediately after saving
        const refreshedUserData = await getUser(user);
        setUserData(refreshedUserData);

        console.log(
          `Saved availability for ${selectedDay}: ${startTime} - ${endTime}`
        );
      }

      setSelectedDay(null);
      handleCloseAvailabilityModal();
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedDay(null);
    setInitialAvailabilityView(true);
  };

  const handleDayButtonClick = (day) => {
    setSelectedDay(day);
    setInitialAvailabilityView(false);

    // Set start time and end time based on the selected day's availability
    setStartTime(
      userData.availability
        ? userData.availability[day]?.startTime || null
        : null
    );
    setEndTime(
      userData.availability ? userData.availability[day]?.endTime || null : null
    );
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const restaurantLocations = [
    "Bangkok Thai",
    "Chipotle",
    "Mia Zas",
    "Potbellys",
    "Raising Canes",
    "Shawarma Joint",
  ];
  const cafeteriaLocations = [
    "Ikenberry Cafeteria",
    "Illinois Street Cafeteria",
    "Lincoln Avenue Cafeteria",
    "Pennsylvania Avenue Cafeteria",
  ];

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    // Reset tab to default when modal is closed
    setActiveTab("restaurants");
  };

  const handleRemoveLocation = async () => {
    try {
      // Update user data with favorites
      //const latestUserData = await getUser(user);
      //const ex = latestUserData.availability ? { ...latestUserData.availability } : {};

      const updatedUserData = {
        fav_locations: fav_locations,
      };

      await updateUser(user, updatedUserData);

      console.log("Saved favorites:", fav_locations);

      handleCloseLocationModal();
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const handleStarClick = (location) => {
    // Add logic for adding/removing location to/from favorites
    setFav_locations((prevFavorites) => {
      const isFavorite = prevFavorites.includes(location);
      return isFavorite
        ? prevFavorites.filter((fav) => fav !== location)
        : [...prevFavorites, location];
    });
  };

  return (
    <div className="profile-page-window">
      <div className="profile">
        <div className="profile-container">
          <div className="profile-image-section">
            {isEditing ? (
              <div>
                <div className="file-button">
                  <button
                    style={{ display: "block", width: "120px", height: "30px" }}
                    onClick={() => document.getElementById("getFile").click()}
                  >
                    Choose File
                  </button>
                  <input
                    type="file"
                    id="getFile"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  ></input>
                </div>
                <div
                  className={
                    userData.profile_pic === "default"
                      ? "default-profile-picture"
                      : "profile-picture"
                  }
                >
                  {/* <div className="profile-picture"> */}
                  {userData.profile_pic !== "default" && (
                    <img src={userData.profile_pic} alt="Profile" />
                  )}
                </div>
              </div>
            ) : (
              // <div className="profile-picture">
              <div
                className={
                  userData.profile_pic === "default"
                    ? "default-profile-picture"
                    : "profile-picture"
                }
              >
                {/* Render image from Base64 string */}
                {userData.profile_pic !== "default" && (
                  <img src={userData.profile_pic} alt="Profile_Image" />
                )}
                {/* {console.log(userData.profile_pic)} */}
              </div>
              // <div className="profile-picture">{userData.profile_pic}</div>
            )}
            <p className="netid">
              <strong>netid:</strong> {userData.netid}
            </p>
          </div>
          <div className="profile-details">
            <h1>Profile</h1>
            {isEditing ? (
              <>
                <div>
                  <label>
                    First Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder="First Name"
                    // value={userData.first_name}
                    value={
                      userData.first_name !== "firstname"
                        ? userData.first_name
                        : ""
                    }
                    onChange={handleChange}
                  />
                  {error.first_name && (
                    <p className="error-message">{error.first_name}</p>
                  )}
                </div>

                <div>
                  <label>
                    Last Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    placeholder="Last Name"
                    value={
                      userData.last_name !== "lastname"
                        ? userData.last_name
                        : ""
                    }
                    onChange={handleChange}
                  />
                  {error.last_name && (
                    <p className="error-message">{error.last_name}</p>
                  )}
                </div>
                <div>
                  <label>
                    Gender <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    name="gender"
                    className="form-control"
                    value={userData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                  {error.gender && (
                    <p className="error-message">{error.gender}</p>
                  )}
                </div>

                <label>Grade</label>
                <select
                  name="grade"
                  className="form-control"
                  value={userData.grade}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Senior">Graduate</option>
                </select>
                <label>Major </label>
                <select
                  name="major"
                  className="form-control"
                  value={userData.major}
                  onChange={handleChange}
                >
                  <option value="">Select Major</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Biology">Biology</option>
                  <option value="Business">Business</option>
                  <option value="Art">Art</option>
                </select>

                <button onClick={handleSaveClick}>Save</button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {userData.first_name}{" "}
                  {userData.last_name}
                </p>
                <p>
                  <strong>Gender:</strong> {userData.gender}
                </p>
                <p>
                  <strong>Grade:</strong>{" "}
                  {userData.grade !== "grade" ? userData.grade : "None"}
                </p>
                <p>
                  <strong>Major:</strong>{" "}
                  {userData.major !== "major" ? userData.major : "None"}
                </p>
                <button onClick={handleEditClick}>Edit</button>
              </>
            )}
          </div>
        </div>
        <div className="bottom-line" />
      </div>

      <div className="preferences-container">
        <ButtonGroup className= "visbutton">
            <Button
              variant="secondary"
              onClick={() => handleToggle("availability")}
              active={viewMode === "availability"}
            >
              Availability
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleToggle("locations")}
              active={viewMode === "locations"}
            >
              Locations
            </Button>
          </ButtonGroup>
        {viewMode === "availability" && (
          <div className="availability-section">
            <div className="availability-info">
              <h2>Availability</h2>
              <ul className="availability-list">
                {daysOfWeek.map((day) => (
                  <li key={day}>
                    <strong>{day}:</strong>{" "}
                    <span className="availability-time">
                      {userData.availability && userData.availability[day]
                        ? `${userData.availability[day].startTime} - ${userData.availability[day].endTime}`
                        : "No Availability Selected"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button id="avail-button" onClick={handleAvailabilityButtonClick}>
              Edit Availability
            </button>
          </div>
        )}
          {viewMode === "locations" && (
          <div className="locations-section">
            <div className="locations-info">
              <h2>Favorite Locations</h2>
              {fav_locations.length > 0 ? (
                <ul>
                  {fav_locations.map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              ) : (
                <p>No favorite locations set.</p>
              )}
            </div>
            <button id="location-button" onClick={handleLocationButtonClick}>
              Edit Locations
            </button>
          </div>
        )}

        {/* Availability Modal */}
        <Modal
          id="avail-modal"
          show={showAvailabilityModal}
          onHide={handleCloseAvailabilityModal}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>Edit Availability</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {initialAvailabilityView ? ( // Check the initial view state
              <>
                <p>Select a day to edit availability:</p>
                {daysOfWeek.map((day, index) => (
                  <Button
                    id="daybutton"
                    key={index}
                    onClick={() => handleDayButtonClick(day)}
                  >
                    {day} -{" "}
                    {userData.availability && userData.availability[day]
                      ? `${userData.availability[day].startTime} - ${userData.availability[day].endTime}`
                      : "No Availability Selected"}
                  </Button>
                ))}
              </>
            ) : (
              <>
                <p>Editing {selectedDay}'s availability:</p>
                {/* Drop-down for Start Time */}
                <Form.Group controlId="startTime">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    as="select"
                    value={startTime !== null ? startTime : ""}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    <option value="">--</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 AM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    {/* Add more options as needed */}
                  </Form.Control>
                </Form.Group>

                {/* Drop-down for End Time */}
                <Form.Group controlId="endTime">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    as="select"
                    value={endTime !== null ? endTime : ""}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <option value="">--</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 AM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    {/* Add more options as needed */}
                  </Form.Control>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={
                initialAvailabilityView
                  ? handleCloseAvailabilityModal
                  : handleBackButtonClick
              }
            >
              {initialAvailabilityView ? "Cancel" : "Back"}
            </Button>
            <Button variant="primary" onClick={handleSaveAvailability}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Location Modal */}
        <Modal
          id="avail-modal"
          show={showLocationModal}
          onHide={handleCloseLocationModal}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>Edit Locations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
            >
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="restaurants">Restaurants</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="cafeterias">Cafeterias</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="restaurants">
                  <ListGroup>
                    {restaurantLocations.map((location, index) => (
                      <ListGroup.Item key={index} action>
                        <FontAwesomeIcon
                          icon={
                            fav_locations.includes(location)
                              ? solidStar
                              : regularStar
                          }
                          className="star-icon"
                          onClick={() => handleStarClick(location)}
                        />
                        {location}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="cafeterias">
                  <ListGroup>
                    {cafeteriaLocations.map((location, index) => (
                      <ListGroup.Item key={index} action>
                        <FontAwesomeIcon
                          icon={
                            fav_locations.includes(location)
                              ? solidStar
                              : regularStar
                          }
                          className="star-icon"
                          onClick={() => handleStarClick(location)}
                        />
                        {location}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLocationModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRemoveLocation}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
