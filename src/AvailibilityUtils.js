import users from './UserRepository'; // Import your user data

// TODO: use db to retrive the users data - check CurrentUser.js to see how it is done
// now I am reading from a local UserRepository.js file
// and you will one more parameter netid to see what is the current user
// can compare the availbility wiht the rest of users in db
// current I only have 3 users in db

export function getUsersWithCompatibleAvailability(currentUser) {
  const compatibleUsers = users.filter((user) => {
    // TODO: 
    // Implement the logic in isCompatible() to check compatibility
    
    return isCompatible(user, currentUser);
  });
  return compatibleUsers;
}

// TODO:
function isCompatible(user, currentUser) {
     console.log(user, currentUser);
    if (user.availability && currentUser.availability) {
      const userAvailability = user.availability;
      const currentUserAvailability = currentUser.availability;

  
      // Iterate over each day of the week
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of daysOfWeek) {
        // Find time slots for the current day
        const userDayAvailability = userAvailability.find(slot => slot.day === day);
        const currentUserDayAvailability = currentUserAvailability.find(slot => slot.day === day);
  
        // If both users have availability for the current day, check for overlaps
        if (userDayAvailability && currentUserDayAvailability) {
            // TODO: 
            // implement the logic to check for overlaps
            console.log(`Compatibility for ${day}: true`);
             return true;
            
        } else {
          // If one of the users doesn't have availability for the current day, they are not compatible
        }
      }
    }
  
    return false; // Users are not compatible

}
  
