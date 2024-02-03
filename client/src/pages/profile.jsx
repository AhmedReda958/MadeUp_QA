// UserProfile.js

import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; // If using React Router for navigation

const UserProfile = () => {
  const { username } = useParams(); // If using React Router for navigation
  console.log(import.meta.env.VITE_API_URL);

  const test = useAxios({ url: `/user/${username}` });

  useEffect(() => {
    console.log(test.response);
    console.log(test.error);
  }, [test.loading]);

  return (
    <div className="container mx-auto p-4">
      {!test.loading ? (
        test.error ? (
          test.error
        ) : (
          test.response.username
        )
      ) : (
        <i className="fa fa-spinner"></i>
      )}
    </div>
  );
};

export default UserProfile;
