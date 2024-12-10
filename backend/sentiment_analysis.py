import openai
import os
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS


load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Allow CORS for both the deployed frontend and local development
CORS(app, resources={r"/*": {"origins": [
    "https://sentimentanalysisusingchatgpt.netlify.app",  # Deployed frontend
    "http://localhost:3000"  # Local frontend
]}})

#Configure OpenAI api key
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable in your .env file.")

# In-memory storage for user history
user_history = []

def sentiment_analysis(text):
    '''Use ChatGPT to analyze sentiment of the given text.'''
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis expert."},
                {"role": "user", "content": f"Analyze the sentiment of the following text: {text}. Provide the sentiment (Positive, Negative, or Neutral) and a score between -1 and 1."}
            ],
            temperature=0.5,
            max_tokens=50
        )
        result = response["choices"][0]["message"]["content"].strip()
        return result
    except Exception as e:
        return f"Error: {e}"

def save_analysis(user_history, directory=os.path.expanduser("~/Desktop/saved_analyses"), filename_prefix="sentiment_report"):
    '''Save sentiment analysis history as text file'''
    if not user_history:
        return "No sentiment analysis history to save."

    # Ensure the directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)

    #Generate the file name with current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(directory, f"{filename_prefix}_{timestamp}.txt")

    try:
        with open(filename, "w") as f:
            for history in user_history:
                text,result = history
                f.write(f"Text: {text}\nResult: {result}\n\n")
        return f"All results have been successfully saved to file {filename}"
    except Exception as e:
        return f"Error saving analysis history: {e}"

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """Analyze the sentiment of the provided text."""
    data = request.json  # Get the JSON data from the request
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    if len(text) > 500:
        return jsonify({"error": "Text exceeds the 500-character limit"}), 400

    #Perform sentiment analysis
    result = sentiment_analysis(text)

    #Add the result to user history
    user_history.append((text,result))

    return jsonify({"result": result}), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    """Retrieve the sentiment analysis history."""
    return jsonify({
        "history": [{"text": text, "result": result} for text, result in user_history]
    }), 200

@app.route('/api/save', methods=['GET'])
def save_history():
    """Save the sentiment analysis history."""
    message = save_analysis(user_history)
    if "No sentiment" in message:
        return jsonify({"message": message}), 200
    return jsonify({"message": message}), 200


if __name__ == "__main__":
    app.run(debug=True)


