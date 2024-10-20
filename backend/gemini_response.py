import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def generate_response(scenario, user_response):

    generation_config = {
        "temperature": 0.7,
        "top_p": 0.9,
        "top_k": 50,
        "max_output_tokens": 1000,  
        "response_mime_type": "text/plain",
    }
    
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(
        history=[]
    )

    prompt = (
    f"Generate a realistic, 50-100 word follow up about {scenario, user_response}. "
    "You are a caller calling a hotline to get help about the conservation provided. "
    "You are taking in a transcript which is your initial call, a response from a counselor on a hotline and you are following up their response to continue the conversation. "
    "Here are examples of converstions for different issues:\n\n"
    
    "1. Substance Abuse Hotline:\n"
    "'Hi, um, I do not really know where to start. I have been struggling with alcohol for a while now, "
    "and it is starting to get out of control. I have tried to quit on my own, but I keep going back. "
    "I do not even know if I want to stop sometimes, but I know it is hurting my family, my job… everything, really.'\n\n"
    "Response:\n"
    "'Thank you for reaching out and sharing that with me. It takes a lot of courage to ask for help, and I want you to know you are not alone. "
    "We can work together to explore some resources and strategies that may help you regain control and support you in making the changes you want.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'But what if I try again and fail? I am scared I will just keep disappointing everyone.'\n\n"

    "2. Suicide Prevention Hotline:\n"
    "'Hi, I do not really know how to say this, but I have been feeling really hopeless lately. "
    "It feels like no matter what I do, nothing gets better. I am just so tired of feeling this way, and sometimes it feels "
    "like it would be easier if I was not here anymore. I have not told anyone about these thoughts because I do not want to be "
    "a burden, but I really need someone to listen.'\n\n"
    "Response:\n"
    "'I am so sorry you are feeling this way. It must be incredibly difficult to carry these feelings alone. "
    "You are not a burden, and I am here to listen and support you. We can talk through this together and find some steps forward that may help.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'What if talking does not change anything? I feel like nothing will ever get better.'\n\n"

    "3. Gambling Addiction Hotline:\n"
    "'Hey, I am in a tough spot. I have been gambling a lot recently, and it is starting to spiral out of control. "
    "I keep thinking the next win will fix everything, but every time, I just end up losing more money. "
    "I am behind on my bills now, and my partner does not know about the debt I have racked up. I know I need to stop, but I do not know how.'\n\n"
    "Response:\n"
    "'I can hear how overwhelming this has been for you. It is not easy to reach out for help, and it is a big step forward. "
    "We can talk about some options and resources, such as support groups or counseling, to help you take control and find a path that works for you.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'What if my partner finds out before I get the help I need? I am scared they will leave me.'\n\n"

    "4. Eating Disorder Hotline:\n"
    "'Hello, um, I do not really know how to talk about this, but I have been struggling with my eating habits for a while now. "
    "I have become obsessed with counting calories and restricting what I eat, and when I do eat, I feel this overwhelming guilt. "
    "I do not feel like I have control over it anymore, and it is starting to affect my health and my relationships. I just feel stuck and scared.'\n\n"
    "Response:\n"
    "'Thank you for opening up about this. It sounds like you have been dealing with a lot on your own, and I want you to know you do not have to face this alone. "
    "We can explore some options for support, whether that is a professional to talk to or other resources that can help you regain a sense of control.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'What if I can never eat normally again? I am afraid I will always feel this way.'\n\n"

    "5. Domestic Violence Hotline:\n"
    "'Hi, I am not sure if I am in the right place, but I do not feel safe at home anymore. My partner has been getting more aggressive lately, "
    "and it is starting to scare me. I always feel like I am walking on eggshells, and I do not know what will set them off. I want to leave, but I am afraid of what might happen if I do. I do not know where to turn.'\n\n"
    "Response:\n"
    "'I am so sorry you are going through this. You do not deserve to feel unsafe, and you have the right to protect yourself. "
    "We can discuss safety planning and connect you with resources or shelters that can offer you a safe space if and when you are ready to take that step.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'But what if they find me? I am scared that leaving might make things worse.'\n\n"

    "6. Sexual Abuse Hotline:\n"
    "'Hi, I am feeling really overwhelmed. I have experienced something that has been hard for me to process, and it was someone I trusted. "
    "I did not know who else to turn to, and I feel so ashamed and confused about everything. I have been trying to cope on my own, but "
    "it has been affecting every part of my life. I just need someone to talk to and understand what I am going through.'\n\n"
    "Response:\n"
    "'I am so sorry this happened to you. It is not your fault, and your feelings are valid. "
    "I want you to know that you are not alone, and there are people who want to help. We can talk through your feelings, and I can connect you to resources and support services if that feels right for you.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'What if people do not believe me? I am afraid of being judged.'\n\n"

    "7. Sexual Harassment Hotline:\n"
    "'Hey, I have been dealing with harassment at my workplace for some time now. There is a colleague who constantly makes inappropriate remarks "
    "and touches me in ways that make me uncomfortable. I have tried to ignore it, but it is affecting my work and my mental health. "
    "I am scared to speak up because I do not want to lose my job or face any retaliation, but I do not know how much longer I can take this.'\n\n"
    "Response:\n"
    "'I am sorry you are going through this. No one should have to feel unsafe or uncomfortable at work. "
    "We can talk about your options and help you develop a plan, whether that involves seeking support from HR, filing a report, or finding resources to protect your rights while maintaining your safety.'\n\n"
    "Follow-up Question from Person in Crisis:\n"
    "'What if speaking up just makes things worse for me? I am scared of losing everything.'\n\n"

    "Use these examples to create a similar, empathetic, and realistic response based on the context provided."
    "REMEMBER YOU ARE DOING FOLLOW-UP FROM PERSON IN CRISIS"
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

