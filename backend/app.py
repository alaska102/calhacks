import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from speech_to_text import transcribe_audio  
from gemini import generate_scenario  
from gemini_response import generate_response  
from insights import generate_insights  

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  
        logging.FileHandler("app.log") 
    ]
)

conversation_history = []

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/generate_scenario', methods=['POST'])
def generate_scenario_route():
    data = request.get_json()
    genre = data.get('genre')
    if not genre:
        logging.error('Genre not provided in request')
        return jsonify({"error": "Genre is required"}), 400

    try:
        scenario = generate_scenario(genre)
        if scenario:
            conversation_history.append({'role': 'system', 'content': scenario})
            logging.debug(f'Scenario generated: {scenario}')
            return jsonify({"scenario": scenario}), 200
        else:
            logging.error('Failed to generate scenario')
            return jsonify({"error": "Failed to generate scenario"}), 500
    except Exception as e:
        logging.error(f'Error during scenario generation: {e}')
        return jsonify({"error": "An error occurred while generating the scenario"}), 500

@app.route('/api/transcribe_audio', methods=['POST'])
def transcribe_audio_route():
    if 'audio' not in request.files:
        logging.error('No audio file in request')
        return jsonify({'error': 'No audio file in request'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        logging.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(audio_file.filename):
        logging.error('Unsupported file type')
        return jsonify({'error': 'Unsupported file type'}), 400

    scenario = request.form.get('scenario', '')
    logging.debug(f'Received scenario: {scenario}')

    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        temp_filename = tmp.name
        try:
            audio_file.save(temp_filename)
            logging.debug(f'Audio file saved at {temp_filename}')
        except Exception as e:
            logging.error(f'Failed to save audio file: {e}')
            return jsonify({'error': 'Failed to save audio file'}), 500

    if not os.path.exists(temp_filename):
        logging.error(f'Audio file does not exist at {temp_filename}')
        return jsonify({'error': 'Audio file not found after saving'}), 500

    try:
        transcription = transcribe_audio(temp_filename)
        logging.debug(f'Transcription successful: {transcription}')
    except Exception as e:
        logging.error(f'Error during transcription: {e}')
        try:
            os.remove(temp_filename)
            logging.debug('Temporary audio file deleted after failed transcription')
        except Exception as ex:
            logging.warning(f'Failed to delete temporary audio file: {ex}')
        return jsonify({'error': 'Failed to transcribe audio'}), 500

    try:
        os.remove(temp_filename)
        logging.debug('Temporary audio file deleted after transcription')
    except Exception as e:
        logging.warning(f'Failed to delete temporary audio file: {e}')

    try:
        response = generate_response(scenario, transcription)
        logging.debug(f'Response generated: {response}')
    except Exception as e:
        logging.error(f'Error during response generation: {e}')
        return jsonify({'error': 'Failed to generate response'}), 500
    
    
    

    

    text = []
    with open('gemini_response.txt', 'r') as file:
        text = [line.strip() for line in file]  

    conversation_history.append({'role': 'user', 'content': transcription})
    conversation_history.append({'role': 'assistant', 'content': ' '.join(text)})  

    return jsonify({
        'text': ' '.join(text) 
    }), 200

@app.route('/api/insights', methods=['GET'])
def insights_route():
    try:
    
        insights = generate_insights(conversation_history)
        if insights:
            logging.debug(f'Insights generated: {insights}')
            return jsonify({'insights': insights}), 200
        else:
            logging.error('Failed to generate insights')
            return jsonify({'error': 'Failed to generate insights'}), 500
    except Exception as e:
        logging.error(f'Error during insights generation: {e}')
        return jsonify({'error': 'An error occurred while generating insights'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f'Unhandled exception: {e}')
    return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
