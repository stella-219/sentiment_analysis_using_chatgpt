import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  {/* Upload file: Populate the content from csv file into text box */}
  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content); // Populate textarea with file content
        setResults([]); // Clear previous results
        setError("");
        setShowResults(false);
      };
      reader.readAsText(file);
    }
  };

  {/* Analyze text: Perform analysis by line */}
  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Error: Please upload a file or enter text for analysis.");
      setShowResults(false);
      return;
    }

    setError(""); // Clear previous error
    setShowResults(false);

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const analysisResults: string[] = [];

    for (const line of lines) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/analyze", { text: line });
        analysisResults.push(`"${line}": ${response.data.result}`);
      } catch (err) {
        analysisResults.push(`"${line}": Error analyzing text.`);
      }
    }

    setResults(analysisResults);
    setShowResults(true); // Show results after analysis is complete
    setSaveMessage(""); // Clear save message
  };

  {/* SaveHistory: Save analysis file in the designated directory */}
  const saveHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/save");
      setSaveMessage(response.data.message);
    } catch (err) {
      setError("Error saving history. Please try again.");
    }
  };

  const clearText = () => {
    setText("");
    setResults([]);
    setError("");
    setSaveMessage("");
    setShowResults(false); 
  };

  return (
    <div className="App">
      <div className="container my-5">
        {/* Image at the Top */}
        <div className="text-center mb-4">
          <img
            src="/images/sentiment_analysis_image.png"
            alt="Sentiment Analysis"
            className="img-fluid"
            style={{ maxHeight: "160px" }}
          />
        </div>

        {/* Textarea for Input */}
        <div className="mb-3 w-50 mx-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-control"
            rows={5}
            placeholder="Please upload a file or enter text for sentiment analysis..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          <label htmlFor="fileUpload" 
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "10px 20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                cursor: "pointer",
                display: "inline-block",
              }}>
            Upload File
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".csv"
            onChange={uploadFile}
            style={{ display: "none" }}
          />
          <button
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "10px 20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={analyzeText}
            >
                Analyze
          </button>
          <button
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "10px 20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={saveHistory}
            >
              Save Analysis
            </button>

          <button
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid black",
              borderRadius: "10px",
              padding: "10px 20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={clearText}
          >
            Clear Text
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Results */}
        {showResults && (
          <div className="mt-4 text-center">
            <h6>Analysis Results:</h6>
            <ul className="list-group">
              {results.map((result, index) => (
                <li key={index} className="list-unstyled">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Save Message */}
        {saveMessage && <p className="text-info text-center mt-4">{saveMessage}</p>}
      </div>
    </div>
  );
};

export default App;
