# Sentiment Analysis Using ChatGPT

## Project Overview
This project is a web-based Sentiment Analysis application powered by OpenAI's ChatGPT API. Users can analyze the sentiment of text input, whether manually entered text or imported via a CSV file, and receive a sentiment score along with its classification (Positive, Negative, or Neutral). The project comprises a **Flask-based backend** and a **React-based frontend**, styled with Bootstrap for a responsive and user-friendly interface.

---

## Features
- **Text Sentiment Analysis**: Analyze manually entered text or text from an uploaded CSV file for sentiment (Positive, Negative, or Neutral) and score (-1 to 1).
- **File Upload**: Import text data from a CSV file to populate the input field.
- **Save Analysis**: Save analysis results to a specified folder (`Desktop/saved_analyses`).
- **Clear Text**: Clear the input field and results.
- **Error Handling**: Real-time validation for input text length and file format.

---

## Installation and Setup

1. Clone the repository from Github.

2. Navigate to backend folder and install virtual environment using `pip install virtualenv`.

3. Create .env file in backend folder and update `OPENAI_API_KEY` for your OpenAI api key.

4. Navigate to project directory and install all the required dependencies using `pip install -r requirements.txt` for Python.

5. Start the backend server(`http://127.0.0.1:5000`) by using `python sentiment_analysis.py`.

6. Navigate to frontend folder and install all dependencies by using `npm install`.

7. Start the React server (`http://localhost:3000`) by using `npm start`. 

