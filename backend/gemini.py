import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def generate_scenario(genre):
   
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.9,
        "top_k": 50,
        "max_output_tokens": 1000,  
        "response_mime_type": "text/plain",
    }
    
    # Initialize the model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(
        history=[]
    )

    prompt = (
        f"Generate a realistic, 100-200 word scenario about {genre}. "
        "You are a caller calling a hotline to get help about the genre provided. "
        "Here are examples of scenarios for different issues:\n\n"
        
        "1. Substance Abuse Hotline:\n"
        "'Hi, um, I do not really know where to start. I have been struggling with alcohol for a while now, "
        "and it is starting to get out of control. I have tried to quit on my own, but I keep going back. "
        "I do not even know if I want to stop sometimes, but I know it is hurting my family, my job… everything, really.'\n\n"

        "2. Suicide Prevention Hotline:\n"
        "'Hi, I do not really know how to say this, but I have been feeling really hopeless lately. "
        "It feels like no matter what I do, nothing gets better. I am just so tired of feeling this way, and sometimes it feels "
        "like it would be easier if I was not here anymore. I have not told anyone about these thoughts because I do not want to be "
        "a burden, but I really need someone to listen.'\n\n"

        "3. Gambling Addiction Hotline:\n"
        "'Hey, I am in a tough spot. I have been gambling a lot recently, and it is starting to spiral out of control. "
        "I keep thinking the next win will fix everything, but every time, I just end up losing more money. "
        "I am behind on my bills now, and my partner does not know about the debt I have racked up. I know I need to stop, but I do not know how.'\n\n"

        "4. Eating Disorder Hotline:\n"
        "'Hello, um, I do not really know how to talk about this, but I have been struggling with my eating habits for a while now. "
        "I have become obsessed with counting calories and restricting what I eat, and when I do eat, I feel this overwhelming guilt. "
        "I do not feel like I have control over it anymore, and it is starting to affect my health and my relationships. I just feel stuck and scared.'\n\n"

        "5. Domestic Violence Hotline:\n"
        "'Hi, I am not sure if I am in the right place, but I do not feel safe at home anymore. My partner has been getting more aggressive lately, "
        "and it is starting to scare me. I always feel like I am walking on eggshells, and I do not know what will set them off. I want to leave, but I am afraid of what might happen if I do. I do not know where to turn.'\n\n"

        "6. Sexual Abuse Hotline:\n"
        "'Hi, I am feeling really overwhelmed. I have experienced something that has been hard for me to process, and it was someone I trusted. "
        "I did not know who else to turn to, and I feel so ashamed and confused about everything. I have been trying to cope on my own, but "
        "it has been affecting every part of my life. I just need someone to talk to and understand what I am going through.'\n\n"

        "7. Sexual Harassment Hotline:\n"
        "'Hey, I have been dealing with harassment at my workplace for some time now. There is a colleague who constantly makes inappropriate remarks "
        "and touches me in ways that make me uncomfortable. I have tried to ignore it, but it is affecting my work and my mental health. "
        "I am scared to speak up because I do not want to lose my job or face any retaliation, but I do not know how much longer I can take this.'\n\n"

        "Use these examples to create a similar, empathetic, and realistic scenario based on the genre provided."
    )

    try:
        response = chat_session.send_message(prompt)
        print(response)  
        if hasattr(response, 'text'):
            return response.text
        else:
            print("Response did not contain expected 'text' attribute")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Test the function
scenario = generate_scenario("gambling addiction")
print(scenario)
