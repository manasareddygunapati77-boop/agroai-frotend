import { useRef } from "react";

function FloatingMic({ setQuery, setIsRecording, selectedLanguage }) {
  const recognitionRef = useRef(null);
  const isRunningRef = useRef(false);

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === "ta" ? "ta-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isRunningRef.current = true;
      setIsRecording(true);
      console.log("🎤 Listening started (" + recognition.lang + ")");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log("VOICE:", text);
      setQuery(text); // ✅ put transcript into search bar
    };

    recognition.onerror = (event) => {
      console.log("Error:", event.error);
      setIsRecording(false);
      isRunningRef.current = false;
    };

    recognition.onend = () => {
      setIsRecording(false);
      isRunningRef.current = false;
      console.log("🎤 Listening ended");
    };

    return recognition;
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (!recognitionRef.current) return;

    if (isRunningRef.current) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Recognition Start Error:", error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRunningRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="floating-mic">
      <button
  type="button"
  onClick={startRecording}
  className={isRunningRef.current ? "recording" : ""}
>
  🎤
</button>

    </div>
  );
}

export default FloatingMic;
