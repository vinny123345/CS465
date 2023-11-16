// TODO:
// some toy files to contrain other users than current users
// don't need this anymore after fully implementing the availbiliyt check for search page

const users = [
  {
    netid: "vadamo2",
    password: "5678",
    first_name: "John",
    last_name: "Doe",
    profile_pic: "user123",
    gender: "male",
    grade: "junior",
    major: "biology",
    availability: [
      { day: 'Wednesday', start: '1:00 PM', end: '2:00 PM' },
      { day: 'Friday', start: '12:30 PM', end: '1:30 PM' },
    ],
    fav_locations: "campus cafe",
    sent_requests: ["jones1", "killeen2"],
    received_requests: ["freddy3", "chica4"],
    confirmed_requests: ["bonnie5"]
  },
  {
    netid: "freddy3",
    password: "password123",
    first_name: "Freddy",
    last_name: "Kreuger",
    profile_pic: "freddy_pic",
    gender: "male",
    grade: "senior",
    major: "psychology",
    availability: [
      { day: 'Monday', start: '11:30 AM', end: '12:30 PM' },
      { day: 'Thursday', start: '1:00 PM', end: '2:00 PM' },
    ],
    fav_locations: "library",
    sent_requests: ["jones1", "killeen2"],
    received_requests: ["vadamo2", "chica4"],
    confirmed_requests: ["bonnie5"]
  }
];

export default users;
  
