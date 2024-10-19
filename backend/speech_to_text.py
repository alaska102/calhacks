import io
import os
from google.oauth2 import service_account
from google.cloud import speech
import pyaudio
import wave

# Set up credentials and client
client_file = 'sa_speech_api.json'  # Ensure this is the correct path to your service account JSON file
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

def record_audio(output_filename, record_seconds=10, rate=16000, channels=1):
    """
    Records audio from the microphone and saves it to an output file.

    Args:
        output_filename (str): The filename where the recorded audio will be saved.
        record_seconds (int): Duration of the recording in seconds.
        rate (int): Sampling rate of the recording.
        channels (int): Number of audio channels.
    """
    chunk = 1024  # Record in chunks of 1024 samples
    format = pyaudio.paInt16  # 16-bit resolution

    p = pyaudio.PyAudio()

    stream = p.open(format=format,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=chunk)

    print("Recording...")
    frames = []

    for _ in range(0, int(rate / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    print("Finished recording.")

    # Stop and close the stream 
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save the recorded data as a WAV file
    wf = wave.open(output_filename, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(format))
    wf.setframerate(rate)
    wf.writeframes(b''.join(frames))
    wf.close()

def transcribe_audio(audio_filename):
    """
    Transcribes the given audio file using Google Cloud Speech-to-Text API.

    Args:
        audio_filename (str): The filename of the audio file to transcribe.

    Returns:
        str: The transcription of the audio file.
    """
    with io.open(audio_filename, 'rb') as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Since we saved the audio as WAV with 16-bit encoding
        sample_rate_hertz=16000,
        language_code='en-US'
    )

    response = client.recognize(config=config, audio=audio)

    transcription = ''
    for result in response.results:
        transcription += result.alternatives[0].transcript + ' '

    return transcription.strip()

def save_transcription(text, filename):
    """
    Saves the given text to a file.

    Args:
        text (str): The text to save.
        filename (str): The filename where the text will be saved.
    """
    with open(filename, 'w') as f:
        f.write(text)

if __name__ == "__main__":
    audio_filename = "output.wav"
    text_filename = "user_response.txt"

    record_seconds = int(input("Enter the duration of the recording in seconds: "))
    record_audio(audio_filename, record_seconds=record_seconds)

    transcription = transcribe_audio(audio_filename)

    save_transcription(transcription, text_filename)

    if os.path.exists(audio_filename):
        os.remove(audio_filename)
        print(f"Deleted the audio file: {audio_filename}")
    else:
        print(f"The file {audio_filename} does not exist.")

    print(f"Transcription saved to {text_filename}")
    print(f"Transcribed Text:\n{transcription}")
