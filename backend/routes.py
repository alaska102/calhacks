from flask import Blueprint, request, jsonify
from gemini import generate_scenario
from voice_output import generate_voice_output
from speech_to_text import transcribe_speech
from gemini_response import generate_follow_up
from insights import generate_insights

main = Blueprint('main', __name__)

# 1. Choose Genre
@main.route('/choose_genre', methods=['POST'])
def choose_genre():
    data = request.json
    genre = data.get('genre')
    if not genre:
        return jsonify({"error": "Genre is required"}), 400

    # Generate scenario using the selected genre
    scenario = generate_scenario(genre)
    return jsonify({"scenario": scenario}), 200

# 2. Generate Voice Output
@main.route('/generate_voice_output', methods=['POST'])
def generate_voice_output_route():
    data = request.json
    scenario = data.get('scenario')
    if not scenario:
        return jsonify({"error": "Scenario is required"}), 400

    # Convert the scenario to voice output
    audio_file = generate_voice_output(scenario)
    return jsonify({"audio_file": audio_file}), 200

# 3. Speech-to-Text Conversion of User Response
@main.route('/speech_to_text', methods=['POST'])
def speech_to_text_route():
    # Convert user's speech to text
    user_text = transcribe_speech()
    if not user_text:
        return jsonify({"error": "No speech detected"}), 400

    # Save the user response to a file
    with open('user_response.txt', 'a') as file:
        file.write(user_text + "\n")
    return jsonify({"user_response": user_text}), 200

# 4. Generate Response Based on User Input
@main.route('/generate_response', methods=['POST'])
def generate_response_route():
    data = request.json
    scenario = data.get('scenario')
    if not scenario:
        return jsonify({"error": "Scenario is required"}), 400

    # Read all user responses so far
    with open('user_response.txt', 'r') as file:
        user_responses = file.readlines()
    
    # Use the latest user response for the follow-up
    user_response = user_responses[-1].strip() if user_responses else ""

    # Generate the response based on the latest user input
    follow_up_response = generate_follow_up(scenario, user_response)
    
    # Save the AI response to a file for continuity in the conversation
    with open('ai_responses.txt', 'a') as file:
        file.write(follow_up_response + "\n")
    
    return jsonify({"follow_up_response": follow_up_response}), 200

# 5. Repeat User Response and AI Follow-up Twice More
@main.route('/repeat_interaction', methods=['POST'])
def repeat_interaction_route():
    data = request.json
    scenario = data.get('scenario')
    if not scenario:
        return jsonify({"error": "Scenario is required"}), 400
    
    # User response and AI follow-up are repeated twice more
    for i in range(2):
        # Get user's response
        user_text = transcribe_speech()
        if not user_text:
            return jsonify({"error": "No speech detected"}), 400

        # Append user response
        with open('user_response.txt', 'a') as file:
            file.write(user_text + "\n")

        # Generate AI response based on the latest user input
        follow_up_response = generate_follow_up(scenario, user_text)

        # Append AI response
        with open('ai_responses.txt', 'a') as file:
            file.write(follow_up_response + "\n")
    
    return jsonify({"message": "Interactions completed"}), 200

# 6. Generate Insights Based on Entire Conversation
@main.route('/generate_insights', methods=['POST'])
def generate_insights_route():
    with open('user_response.txt', 'r') as user_file:
        user_responses = user_file.readlines()

    with open('ai_responses.txt', 'r') as ai_file:
        ai_responses = ai_file.readlines()

    transcript = "".join([f"User: {u.strip()} | AI: {a.strip()}\n" for u, a in zip(user_responses, ai_responses)])
    if not transcript:
        return jsonify({"error": "Transcript is required"}), 400

    # Generate insights based on the entire conversation
    insights = generate_insights(transcript, user_responses)
    return jsonify({"insights": insights}), 200
