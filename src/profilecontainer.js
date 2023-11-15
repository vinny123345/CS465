import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser, updateUser } from "./DBUtils";
import './ProfileContainer.css';
import {Button, Modal, Nav, Tab, ListGroup, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

export const Profilecontainer = () => {
  const { user } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    grade: '',
    major: '',
    profile_pic: '',
    netid: '',
  });
  const [initialAvailabilityView, setInitialAvailabilityView] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleLocationButtonClick = () => setShowLocationModal(true);

  const handleCloseAvailabilityModal = () => setShowAvailabilityModal(false);  
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [fav_locations, setFav_locations] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurants');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser(user);
        setUserData(data);
        console.log(data.availability[2]);
        console.log(data.fav_locations);
        if (data.availability) {
          const days = Object.keys(data.availability);
          const selectedDay = days.length > 0 ? days[0] : null;
  
          const { startTime, endTime } = data.availability[selectedDay] || {};

          console.log('Selected Day:', selectedDay);
          console.log('Start Time:', startTime);
          console.log('End Time:', endTime);
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
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateUser(user, userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
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

  const handleAvailabilityButtonClick = () => {
    setShowAvailabilityModal(true);
    setInitialAvailabilityView(true);
    // Set selected day, start time, and end time to current values from user data
    setSelectedDay(userData.availability ? Object.keys(userData.availability)[0] : null);
    setStartTime(userData.availability ? userData.availability[selectedDay]?.startTime || null : null);
    setEndTime(userData.availability ? userData.availability[selectedDay]?.endTime || null : null);
  };

  const handleSaveAvailability = async () => {
    try {
      if (selectedDay && startTime !== null && endTime !== null) {
        // Clone the existing availability object or create a new one if it doesn't exist
        const existingAvailability = userData.availability ? { ...userData.availability } : {};
  
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
  
        console.log(`Saved availability for ${selectedDay}: ${startTime} - ${endTime}`);
      }

      setSelectedDay(null);
      handleCloseAvailabilityModal();
    } catch (error) {
      console.error('Error saving availability:', error);
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
    setStartTime(userData.availability ? userData.availability[day]?.startTime || null : null);
    setEndTime(userData.availability ? userData.availability[day]?.endTime || null : null);
  };
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const restaurantLocations = ['Bangkok Thai', 'Chipotle', 'Mia Zas', 'Potbellys','Raising Canes', 'Shawarma Joint'];
  const cafeteriaLocations = ['Ikenberry Cafeteria', 'Illinois Street Cafeteria', 'Lincoln Avenue Cafeteria', 'Pennsylvania Avenue Cafeteria'];


  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    // Reset tab to default when modal is closed
    setActiveTab('restaurants');
  };

  const handleRemoveLocation = async () => {
    try {
      // Update user data with favorites
      const updatedUserData = {
        ...userData,
        fav_locations: fav_locations,
      };
  
      await updateUser(user, updatedUserData);
  
      console.log('Saved favorites:', fav_locations);
  
      handleCloseLocationModal();
    } catch (error) {
      console.error('Error saving favorites:', error);
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
    <>
      <div className="profile">
        <div className="profile-container">
        <div className="profile-image-section">
          {isEditing ? (
            <div className = "file-button"> 
              <button style={{ display: 'block', width: '120px', height: '30px' }} onClick={() => document.getElementById('getFile').click()}>Choose File</button>
              <input type='file' id="getFile" style={{ display: 'none' }} onChange={handleImageChange}></input>
            </div>
          ) : (
            <div className="profile-picture">{userData.profile_pic}</div>
          )}
          <p className="netid"><strong>netid:</strong> {userData.netid}</p>
        </div>
        <div className="profile-details">
          <h1>Profile</h1>
          {isEditing ? (
            <>
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={userData.first_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={userData.last_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
              />
              <input
                type="text"
                name="grade"
                className="form-control"
                value={userData.grade}
                onChange={handleChange}
              />
              <input
                type="text"
                name="major"
                className="form-control"
                value={userData.major}
                onChange={handleChange}
              />
              <button onClick={handleSaveClick}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
              <p><strong>Gender:</strong> {userData.gender}</p>
              <p><strong>Grade:</strong> {userData.grade}</p>
              <p><strong>Major:</strong> {userData.major}</p>
              <button onClick={handleEditClick}>Edit</button>
            </>
          )}
        </div>
      </div>
      <div className="bottom-line" />
    </div>
    <div className="preferences-buttons">
      <button id="avail-button" onClick={handleAvailabilityButtonClick}>
        Edit Availability
      </button>

      <button id="location-button" onClick={handleLocationButtonClick}>
        Edit Locations
      </button>

      {/* Availability Modal */}
      <Modal id="avail-modal" show={showAvailabilityModal} onHide={handleCloseAvailabilityModal}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {initialAvailabilityView ? ( // Check the initial view state
            <>
              <p>Select a day to edit availability:</p>
              {daysOfWeek.map((day, index) => (
                <Button id="daybutton" key={index} onClick={() => handleDayButtonClick(day)}>
                  {day}
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
                  value={startTime !== null ? startTime : ''}
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
                  value={endTime !== null ? endTime : ''}
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
          <Button variant="secondary" onClick={initialAvailabilityView ? handleCloseAvailabilityModal : handleBackButtonClick}>
            {initialAvailabilityView ? 'Cancel' : 'Back'}
          </Button>
          <Button variant="primary" onClick={handleSaveAvailability}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Location Modal */}
      <Modal id =  "avail-modal" show={showLocationModal} onHide={handleCloseLocationModal}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
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
                        icon={fav_locations.includes(location) ? solidStar : regularStar}
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
                        icon={fav_locations.includes(location) ? solidStar : regularStar}
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

    </>
  );
};