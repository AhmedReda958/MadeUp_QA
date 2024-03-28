export const userBriefProject = {
  _id: 1,
  username: 1,
  fullName: 1,
  profilePicture: 1,
  lastSeen: 1,
  verified: 1,
  // TODO: add those later on
  // "hasStory"
};

export const allowedUserUpdates = [
  "username",
  "fullName",
  "bio",
  "profilePicture"
];

export const privateUserData = [ // TODO: user preferences
  "email"
];
