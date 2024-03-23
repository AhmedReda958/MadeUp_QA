import React from "react";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";

function ProfilePic({
  data,
  imgUrl,
  className = "",
  story = false,
  border = true,
}) {
  return (
    <div
      className={`rounded-full ${border && "p-[3px]"} ${className} ${
        story
          ? " bg-gradient-to-br from-primary-dark via-gred-light  to-alt"
          : "bg-altcolor"
      }`}
    >
      <img
        src={imgUrl || data?.profilePicture || MaleProfilePic}
        draggable="false"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = MaleProfilePic;
        }}
        alt="profile pic"
        className="rounded-full w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

export default ProfilePic;
