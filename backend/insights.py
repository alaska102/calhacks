import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def generate_insights(transcript, user_responses):
    """
    Generate insights using the Gemini API based on the conversation transcript and user responses.
    
    Parameters:
        transcript (str): The full transcript of the conversation including user and AI responses.
        user_responses (list): A list of user responses throughout the conversation.
        
    Returns:
        dict: A dictionary containing the insights about the conversation.
    """
    # Prepare the prompt for the Gemini API
    prompt = (
        f"Analyze the following conversation transcript between an AI acting as a person in crisis calling a hotline and the user as the counselour responding on the hotline :\n\n"
        f"{transcript}\n\n"
        f"The user's who's behaving a as a counselour responses throughout the conversation are:\n"
        f"{' '.join(user_responses)}\n\n"
        "Please provide a detailed summary of the conversation, identifying what the user could have done better, any words or phrases they missed, "
        "and specific areas for improvement. Focus on clarity, completeness, and any missed emotional cues or responses. "
        "Also, suggest actionable steps the user could take to improve their performance in a similar situation."
    )
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 50,
                "max_output_tokens": 1000,
                "response_mime_type": "text/plain",
            }
        )
        
        chat_session = model.start_chat(history=[])

        response = chat_session.send_message(prompt)
        if hasattr(response, 'text'):
            return {"insights": response.text}
        else:
            print("Response did not contain expected 'text' attribute")
            return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
