import { useRef } from "react";
import "../styles/Uploadcard.css";

function UploadCard({
  onImageUpload,
  uploadedImage,
}) {
  const fileRef = useRef();

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = (e) => {
    const file =
      e.target.files?.[0];

    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="upload-card">

      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt="crop"
          className="preview"
        />
      ) : (
        <div className="upload-icon">
          📤
        </div>
      )}

      <h3>
        Upload Crop Image
      </h3>

      <button
        onClick={handleClick}
      >
        Choose Image
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

    </div>
  );
}

export default UploadCard;