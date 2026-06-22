import { useRef } from "react";
import "../styles/FloatingMic.css";

function FloatingMic({ onSearch, setIsRecording, language }) {
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = language || "en-IN";
      recognitionRef.current.continuous = false; // one phrase at a time
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        console.log("🎤 Listening started");
      };

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        console.log("VOICE:", text);
        if (onSearch) onSearch(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.log("Error:", event.error);
        if (event.error === "no-speech") {
          alert("No speech detected. Please speak louder and closer to the microphone.");
        }
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        console.log("🎤 Listening ended");
      };
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Recognition Start Error:", error);
    }
  };

  return (
    <div className="floating-mic">
      <button type="button" onClick={startRecording}>
        🎤
      </button>
    </div>
  );
}

export default FloatingMic;
