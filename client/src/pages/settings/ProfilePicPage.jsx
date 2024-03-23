import React, { useRef, useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import Page from "@/components/ui/Page";
import ProfilePic from "@/components/ProfilePic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CameraIcon } from "@heroicons/react/24/solid";
import useAlert from "@/utils/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfilePicPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const Alert = useAlert();
  const navigate = useNavigate();

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    const formData = new FormData();

    formData.append("type", "image");
    formData.append("image", file);

    // upload image to imgur
    const CLIENT_ID = "b417912ffdff89e";
    setLoading(true);
    await axios
      .post("https://api.imgur.com/3/image", formData, {
        headers: {
          Authorization: "Client-ID  " + CLIENT_ID, // TODO: configure
        },
      })
      .then(function (response) {
        const { link, deletehash } = response.data.data;
        applyNewPic(link, deletehash);
      })
      .catch(function (response) {
        console.error(response);
        setError("Error uploading image");
      })
      .finally(() => {
        setError(null);
        setLoading(false);
      });
  };

  const applyNewPic = async (link) => {
    await axios
      .patch("users", { profilePicture: link })
      .then((res) => {
        Alert({ title: "Profile updated", type: "success" });
        navigate(`/${userInfo.username}`);
      })
      .catch((error) => {
        console.log(error);
        Alert({ title: "Error updating profile", type: "error" });
      });
  };

  return (
    <Page title="Profile Picture">
      <form onSubmit={handleImageUpload}>
        <div className="flex justify-center">
          <ProfilePic
            imgUrl={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : userInfo.profilePicture
            }
            className="w-40 h-40 shadow "
          />
        </div>

        <Button
          as="label"
          color="dark"
          className="w-full mt-4 text cursor-pointer"
          htmlFor="imgUploader"
        >
          <CameraIcon className="w-6 h-6 me-3" />
          Choose new picture
        </Button>
        <input
          type="file"
          accept="image/*"
          id="imgUploader"
          ref={fileInput}
          onChange={handleImageSelect}
          disabled={loading}
          hidden
        />
        {error && <p className="test-sm text-red-600">{error}</p>}
        <Button
          color="primary"
          type="submit"
          className="w-full mt-6"
          disabled={loading || !selectedImage}
        >
          Save
        </Button>
      </form>
    </Page>
  );
};

export default ProfilePicPage;
