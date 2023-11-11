const user = {
  netid: "jones1",
  password: "1234",
  first_name: "Chancellor",
  last_name: "Jones",
  profile_pic: "default",
  gender: "male",
  grade: "senior",
  major: "computer science",
  availability: "default",
  fav_locations: "default",
  sent_requests: ["vadamo2", "killeen2"],
  received_requests: ["freddy3", "chica4"],
  confirmed_requests: ["bonnie5", "foxy8"],
};

// make functions to find/retrieve/edit users here

export function getUser(input_user) {
  return user;
}
