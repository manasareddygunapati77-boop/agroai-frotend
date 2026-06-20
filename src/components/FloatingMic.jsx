import "../styles/FloatingMic.css";

function FloatingMic({
  onSearch,
  setIsRecording,
  language,
}) {
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language || "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("🎤 Listening started");
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      console.log("VOICE:", text);

      if (onSearch) {
        onSearch(text);
      }
    };

   recognition.onerror = (event) => {
  console.log("Error:", event.error);

  if (event.error === "no-speech") {
    alert("No speech detected. Please speak louder and closer to the microphone.");
  }

  setIsRecording(false);

      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("🎤 Listening ended");
    };

    try {
      setTimeout(() => {
        recognition.start();
      }, 200);
    } catch (error) {
      console.log(
        "Recognition Start Error:",
        error
      );
    }
  };

  return (
    <div className="floating-mic">
      <button
        type="button"
        onClick={startRecording}
      >
        🎤
      </button>
    </div>
  );
}

export default FloatingMic;