// services/userService.js
import axios from "axios";

const userService = {
  getUserProfile: async (userId) => {
    const response = await axios.get(`/user/${userId}`);
    return response.data;
  },

  updateUserProfile: async (updatedData) => {
    const response = await axios.put(
      `/users/${updatedData.userId}`,
      updatedData
    );
    return response.data;
  },
};

export default userService;
