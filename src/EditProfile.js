import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { updateUser, getUser } from './CurrentUser';

export const EditProfile  = () => {
  const { user } = useParams();
  const [editedUser, setEditedUser] = useState(getUser(user));
  

  // Use useEffect to fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(user);
        setEditedUser(userData);
      } catch (error) {
        // Handle any errors, e.g., user not found
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // console.log("handlesave");
    // console.log('Edited User Data:', editedUser);
    updateUser(user, editedUser);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={editedUser.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={editedUser.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="text"
            name="profile_pic"
            value={editedUser.profile_pic}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={editedUser.gender}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Grade:</label>
          <input
            type="text"
            name="grade"
            value={editedUser.grade}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Major:</label>
          <input
            type="text"
            name="major"
            value={editedUser.major}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Availability:</label>
          <input
            type="text"
            name="availability"
            value={editedUser.availability}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Favorite Locations:</label>
          <input
            type="text"
            name="fav_locations"
            value={editedUser.fav_locations}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button onClick={handleSave}>Save</button>
      <Link to={`/profile/${user}`}>Cancel</Link>
    </div>
  );
};








