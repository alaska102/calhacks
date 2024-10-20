import whisper

def transcribe_audio(audio_filename):
    """
    Transcribes the given audio file using OpenAI's Whisper model.

    Args:
        audio_filename (str): The filename of the audio file to transcribe.

    Returns:
        str: The transcription of the audio file.
    """
    # Load the Whisper model; options are tiny, base, small, medium, large
    model = whisper.load_model("tiny")

    # Transcribe the audio file
    result = model.transcribe(audio_filename)
    transcript = result['text']

    return transcript
