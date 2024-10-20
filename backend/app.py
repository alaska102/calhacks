from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from speech_to_text import transcribe_audio  # Import the transcribe function
from gemini import generate_scenario
from gemini_response import generate_response  # Import the generate_response function
from insights import generate_insights  # Import the generate_insights function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the conversation transcript
conversation_history = []

@app.route('/api/generate_scenario', methods=['POST'])
def generate_scenario_route():
    data = request.get_json()
    genre = data.get('genre')
    if not genre:
        return jsonify({"error": "Genre is required"}), 400

    scenario = generate_scenario(genre)
    if scenario:
        conversation_history.append({'role': 'system', 'content': scenario})
        return jsonify({"scenario": scenario}), 200
    else:
        return jsonify({"error": "Failed to generate scenario"}), 500

@app.route('/api/transcribe_audio', methods=['POST'])
def transcribe_audio_route():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file in request'}), 400

    audio_file = request.files['audio']
    scenario = request.form.get('scenario', '')

    audio_filename = 'uploaded_audio.wav'
    audio_file.save(audio_filename)

    # Get the transcription as a string
    transcription = transcribe_audio(audio_filename)

    # Delete the temporary audio file
    os.remove(audio_filename)
    print("File received and deleted")

    # Generate a response using the transcription and scenario
    response_text = generate_response(scenario, transcription)

    # Add the user's transcription and AI response to the conversation history
    conversation_history.append({'role': 'user', 'content': transcription})
    conversation_history.append({'role': 'assistant', 'content': response_text})

    # Return the transcription and the generated response in a JSON response
    return jsonify({
        'transcription': transcription,
        'response': response_text,
        'scenario': scenario
    })

@app.route('/api/insights', methods=['GET'])
def insights_route():
    # Generate insights based on the accumulated conversation history
    insights = generate_insights(conversation_history)
    return jsonify({'insights': insights})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
