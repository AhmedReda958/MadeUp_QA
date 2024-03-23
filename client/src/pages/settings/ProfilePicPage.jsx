import React, { useRef, useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import Page from "@/components/ui/Page";

const ProfilePicPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);

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
        const { link } = response.data.data;
        setImageUrl(link);
        alert("Image uploaded successfully");
      })
      .catch(function (response) {
        console.error(response);
        setImageUrl(null);
        setError("Error uploading image");
      })
      .finally(() => {
        setError(null);
        setLoading(false);
      });
  };

  return (
    <Page title="Profile Picture">
      <form onSubmit={handleImageUpload}>
        <input type="file" accept="image/*" ref={fileInput} />
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            required
          />
        )}
        {error && <p className="test-sm text-red-600">{error}</p>}
        <Button type="submit">Upload</Button>
      </form>
    </Page>
  );
};

export default ProfilePicPage;
