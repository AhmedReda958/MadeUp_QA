import React, { memo } from "react";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";
import AnnoymousUserPic from "@/assets/imgs/anonymous-user.png";

function ProfilePic({
  data,
  imgUrl,
  annoymous = false,
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
        src={
          annoymous
            ? AnnoymousUserPic
            : imgUrl || data?.profilePicture?.link || MaleProfilePic
        }
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = MaleProfilePic;
        }}
        draggable="false"
        alt="profile pic"
        className={`rounded-full w-full h-full ${annoymous && "dark:invert"}`}
        loading="lazy"
      />
    </div>
  );
}

export default memo(ProfilePic);
