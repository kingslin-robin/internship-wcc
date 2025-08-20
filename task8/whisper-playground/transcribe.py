from faster_whisper import WhisperModel

# Model sizes: tiny, base, small, medium, large-v3
model = WhisperModel("small", device="cpu", compute_type="int8")  # use "cuda" if you have a compatible NVIDIA GPU

audio_path = "sample.mp3"
 # put your audio file here
segments, info = model.transcribe(audio_path, beam_size=5)

print(f"Detected language: {info.language}, probability: {info.language_probability:.2f}")
for s in segments:
    print(f"[{s.start:.2f} → {s.end:.2f}] {s.text}")
