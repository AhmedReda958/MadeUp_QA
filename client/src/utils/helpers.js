export const formatDate = (dateString) => {
  const options = {
    hour: "numeric",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const determineLoginType = (credentials) => {
  // Determine if the entered value is an email or mobile number
  const isEmail = /\S+@\S+\.\S+/.test(credentials.username);
  const isMobile = /^\d{10}$/.test(credentials.username);

  // You can customize this logic based on your requirements
  let loginData = {};
  if (isEmail) {
    loginData = {
      email: credentials.username,
      password: credentials.password,
    };
  } else if (isMobile) {
    loginData = {
      mobile: credentials.username,
      password: credentials.password,
    };
  } else {
    loginData = {
      username: credentials.username,
      password: credentials.password,
    };
  }

  return loginData;
};
