import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser, updateUser } from "./DBUtils";
import './ProfileContainer.css';
import {Button, Modal} from 'react-bootstrap';

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
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleAvailabilityButtonClick = () => setShowAvailabilityModal(true);
  const handleLocationButtonClick = () => setShowLocationModal(true);

  const handleCloseAvailabilityModal = () => setShowAvailabilityModal(false);
  const handleCloseLocationModal = () => setShowLocationModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser(user);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [user]);

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

  const handleRemoveAvailability = () => {
    // Add logic for removing availability
    handleCloseAvailabilityModal();
  };

  const handleRemoveLocation = () => {
    // Add logic for removing location
    handleCloseLocationModal();
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
      <Modal id =  "avail-modal" show={showAvailabilityModal} onHide={handleCloseAvailabilityModal}>
      <Modal.Header closeButton={false}>
          <Modal.Title>Edit Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Availability Modal!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAvailabilityModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRemoveAvailability}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Location Modal */}
      <Modal id =  "loc-modal"show={showLocationModal} onHide={handleCloseLocationModal}>
      <Modal.Header closeButton={false}>
          <Modal.Title>Edit Locations</Modal.Title>
        </Modal.Header>
        {/* Add your modal body content here */}
        <Modal.Body>
          Location
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