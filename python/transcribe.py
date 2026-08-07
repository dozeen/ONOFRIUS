from faster_whisper import WhisperModel
import sys

model = WhisperModel(
    "small",
    device="cuda",
    compute_type="float16"
)

segments, info = model.transcribe(sys.argv[1])

text = ""

for segment in segments:
    text += segment.text.strip() + " "

print(text.strip())

