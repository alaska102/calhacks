import os
from dotenv import load_dotenv
from cartesia import Cartesia
import pyaudio
import uuid

load_dotenv()

client = Cartesia(api_key=os.environ.get("CARTESIA_API_KEY"))

def text_to_speech(scenario):
    """
    Converts the given transcript into speech using Cartesia's TTS API with 'distraught' emotion and plays it in real-time.

    Args:
        transcript (str): The text that needs to be converted to speech.

    Returns:
        str: The filename of the saved audio file if successful, None otherwise.
    """
    # Configuration settings
    voice_id = "a0e99841-438c-4a64-b679-ae501e7d6091"  # Example voice ID for "Barbershop Man"
    model_id = "sonic-english"
    output_format = {
        "container": "raw",
        "encoding": "pcm_f32le",
        "sample_rate": 44100,
    }
    _experimental_voice_controls={"speed": "slow", "emotion": ["sadness:highest"]},


    p = pyaudio.PyAudio()
    rate = 44100
    stream = None
    audio_file = f"{uuid.uuid4()}.wav"

    try:
        voice = client.voices.get(id=voice_id)

        for output in client.tts.sse(
            model_id=model_id,
            transcript=transcript,
            voice_embedding=voice["embedding"],
            stream=True,
            output_format=output_format,
        ):
            buffer = output["audio"]  

            if not stream:
                stream = p.open(format=pyaudio.paFloat32, channels=1, rate=rate, output=True)

            # Play the audio data
            stream.write(buffer)

        # Stop and close the audio stream
        if stream:
            stream.stop_stream()
            stream.close()

        return audio_file

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

    finally:
        # Terminate the PyAudio instance
        p.terminate()

transcript = "Hello, um, I'm not sure if I'm calling the right place, but I really need help. I've been struggling with my eating for a while now, and it's getting worse. I feel like I'm constantly thinking about food, and I'm always trying to restrict what I eat. I'm so scared of gaining weight, and I feel like I have no control over it. I've tried to stop on my own, but I always end up going back to the same patterns. I'm starting to feel really weak and tired all the time, and I'm worried about what this is doing to my body. I don't know what to do anymore. I just feel so lost and alone." 

text_to_speech(transcript)
