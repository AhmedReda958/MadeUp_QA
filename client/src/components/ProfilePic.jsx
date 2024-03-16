import React from "react";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";

function ProfilePic({ data, className = "", story = false, border = true }) {
  return (
    <div
      className={`rounded-full ${border && "p-1"} ${className} ${
        story ? " bg-green-400" : "bg-altcolor"
      }`}
    >
      <img
        src={data?.profilePicture || MaleProfilePic}
        draggable="false"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = MaleProfilePic;
        }}
        alt="profile pic"
        className="rounded-full w-full h-full"
      />
    </div>
  );
}

export default ProfilePic;
