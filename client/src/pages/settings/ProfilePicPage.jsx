import React, { useRef, useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import Page from "@/components/ui/Page";
import ProfilePic from "@/components/ProfilePic";
import AvatarEditor from "react-avatar-editor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CameraIcon } from "@heroicons/react/24/solid";
import useAlert from "@/utils/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";

const ProfilePicPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);

  //editor
  const [showEditor, setShowEditor] = useState(false);
  const editorRef = useRef(null);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const Alert = useAlert();
  const navigate = useNavigate();

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setShowEditor(true);
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
        setCredentials(res.data);
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
        {!showEditor ? (
          <>
            <div className="flex justify-center">
              <ProfilePic
                imgUrl={selectedImage ? selectedImage : userInfo.profilePicture}
                className="w-40 h-40 shadow "
              />
            </div>
            {loading && <LoadingSpinner className="mt-4" />}
            {/* image picker */}
            <Button
              as="label"
              color="dark"
              className="w-full mt-4 text cursor-pointer"
              htmlFor="imgUploader"
            >
              <CameraIcon className="w-6 h-6 me-3" />
              Choose new picture
              <input
                type="file"
                accept="image/*"
                id="imgUploader"
                ref={fileInput}
                onChange={handleImageSelect}
                disabled={loading}
                hidden
              />
            </Button>

            {error && <p className="test-sm text-red-600">{error}</p>}

            <Button
              color="primary"
              type="submit"
              className="w-full mt-6"
              disabled={loading || !selectedImage}
            >
              Save
            </Button>
          </>
        ) : (
          <div>
            <ImageEditor
              image={selectedImage}
              ref={editorRef}
              setSelectedImage={setSelectedImage}
              setShowEditor={setShowEditor}
            />
          </div>
        )}
      </form>
    </Page>
  );
};

const ImageEditor = ({ image, setSelectedImage, setShowEditor }) => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);

  const handleScale = (event) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div>
      <AvatarEditor
        ref={editorRef}
        image={image}
        width={250}
        height={250}
        border={30}
        color={[0, 0, 0, 0.6]} // RGBA
        backgroundColor="#fff"
        scale={scale}
        rotate={rotate}
        borderRadius={200}
        className="border-4 border-dashed border-body-alt dark:border-body m-auto"
      />
      <div className="flex items-center gap-3 mt-5">
        <input
          name="scale"
          type="range"
          onChange={handleScale}
          min="0.5"
          max="2"
          step="0.01"
          className="w-full "
          defaultValue="1"
          showgrid={true}
        />
        <span>{scale.toFixed(2)}x</span>
      </div>
      <div className="flex gap-3 mt-2">
        <Button
          color="gray"
          outline
          onClick={() => {
            setRotate(rotate - 90);
          }}
        >
          <i className="fas fa-rotate-left fa"></i>
        </Button>
        <Button
          color="gray"
          outline
          onClick={() => {
            setRotate(rotate + 90);
          }}
        >
          <i className="fas fa-rotate-right"></i>
        </Button>
      </div>
      <Button
        color="primary"
        className="w-full mt-6"
        onClick={() => {
          setSelectedImage(editorRef.current.getImage().toDataURL());
          setShowEditor(false);
        }}
      >
        Apply
        <i className="fas fa-check ms-2"></i>
      </Button>
      <Button
        color="gray"
        className="w-full mt-4"
        onClick={() => {
          setShowEditor(false);
          setSelectedImage(null);
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default ProfilePicPage;
