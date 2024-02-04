// UserProfile.js

import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MaleProfilePic from "@/assets/imgs/MaleProfilePic.png";

import SendMessageFrom from "@/components/SendMessageFrom";

const UserProfile = () => {
  const { username } = useParams();

  const user = useAxios({ url: `/user/${username}` });

  const { response, error, loading } = user;
  useEffect(() => {
    console.log(user.response);
    console.log(user.error);
    console.log(user.statusCode);
  }, [loading]);

  return (
    <div>
      {!loading ? (
        error ? (
          error
        ) : (
          <div>
            <h1 className="text-xl mb-3 ms-2 text-body dark:text-secondary">
              {response.username}
            </h1>
            <div className="flex">
              <div className=" bg-altcolor p-1 rounded-full">
                <img
                  src={response.UserProfile || MaleProfilePic}
                  alt="profile pic"
                  className=" h-24 w-24 rounded-full"
                />
              </div>
              <div className="text-altcolor font-bold text-center grow flex items-center justify-around">
                <div>
                  <div>0</div> followers
                </div>
                <div>
                  <div>0</div> following
                </div>
              </div>
            </div>
            <div className="ps-2 mt-1">
              <h2 className="text-altcolor font-bold text-xl ">
                {response.fullname || response.username}
              </h2>
              <p className="text-body dark:text-secondary-alt text-lg ">
                {response.bio}
              </p>
            </div>
            <SendMessageFrom username={username} show />
            <div className="py-4 flex justify-between">
              <div className="text-altcolor font-simibold">Answers 42</div>
              <div>Likes 53</div>
              <div>Score 182</div>
            </div>
          </div>
        )
      ) : (
        <div className="text-2xl text-center">
          <i className="fa fa-spinner fa-spin-pulse"></i>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
