import React, { memo } from "react";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";
import AnnoymousUserPic from "@/assets/imgs/anonymous-user.png";
import { isUserOnline } from "@/utils/userProfileHelpers";

function ProfilePic({
  data,
  imgUrl,
  annoymous = false,
  className = "",
  story = false,
  border = true,
  showLastSeen = false,
}) {
  const isOnline = isUserOnline(data?.lastSeen);
  return (
    <div
      className={`relative rounded-full ${border && "p-[3px]"} ${className} ${
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
      {isOnline && showLastSeen && (
        <div className="absolute bottom-0 right-0 flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded-full  border-2 border-green-200"></div>
        </div>
      )}
    </div>
  );
}

export default memo(ProfilePic);
