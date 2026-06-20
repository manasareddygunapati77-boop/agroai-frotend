import { useState } from "react";

import UploadCard from "../components/UploadCard";
import DiagnosisCard from "../components/DiagnosisCard";

import {
  predictDisease,
} from "../services/disease";

function DiseaseDetection() {
  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleImageUpload = (file) => {
    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleDetect = async () => {
    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const response =
        await predictDisease(
          imageFile
        );

      console.log(
        "API Response:",
        response
      );

      const prediction =
        response.disease_prediction;

      const lines =
        prediction.split("\n");

      const disease =
        lines[0]
          .replace("Disease: ", "")
          .replaceAll("__", " - ")
          .replaceAll("_", " ");

      const confidence =
        lines[1]
          ?.replace(
            "Confidence: ",
            ""
          ) || "N/A";

      setResult({
        disease,
        confidence,
        status:
          response.status,
      });
    } catch (error) {
      console.error(error);

      alert(
        "Disease detection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UploadCard
        onImageUpload={
          handleImageUpload
        }
        uploadedImage={
          imagePreview
        }
      />

      <button
        onClick={
          handleDetect
        }
      >
        {loading
          ? "Detecting..."
          : "Detect Disease"}
      </button>

      <DiagnosisCard
        result={result}
      />
    </div>
  );
}

export default DiseaseDetection;