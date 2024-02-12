import React from "react";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";

function ProfilePic({ data, className = "", story = false }) {
  return (
    <div
      className={`p-1 rounded-full ${story ? " bg-green-400" : "bg-altcolor"}`}
    >
      <img
        src={data.profilePicture || MaleProfilePic}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = MaleProfilePic;
        }}
        alt="profile pic"
        className={"rounded-full " + className}
      />
    </div>
  );
}

export default ProfilePic;
