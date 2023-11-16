import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.first_name}</h3>
      <p>Availability:</p>
      <ul>
        {user.availability.map((slot, index) => (
          <li key={index}>
            {slot.day}: {slot.start} - {slot.end}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCard;
