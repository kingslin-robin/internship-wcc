from gtts import gTTS
import os

# Your text
text = "Hello, I am a text to speech example running in Python."

# Create TTS object
tts = gTTS(text=text, lang="en")

# Save the audio file
output_file = "output.mp3"
tts.save(output_file)

# Play it (works on Windows, Mac, Linux)
os.system(f"start {output_file}")  # On Windows
# os.system(f"open {output_file}")   # On Mac
# os.system(f"xdg-open {output_file}")  # On Linux
