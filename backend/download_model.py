from huggingface_hub import hf_hub_download
import shutil
import sys

print("Searching for weapon models...")

models_to_try = [
    ("Subh775/Firearm_Detection_Yolov8n", "best.pt"),
    ("Subh775/Threat-Detection-YOLOv8n", "best.pt"),
    ("Zcket/gun_dtct", "best.pt"),
    ("keremberke/yolov8m-weapon-detection", "best.pt"),
]

for repo, filename in models_to_try:
    try:
        print(f"Trying to download {filename} from {repo}...")
        model_path = hf_hub_download(repo_id=repo, filename=filename)
        shutil.copy(model_path, "weapon_model.pt")
        print(f"SUCCESS: Downloaded model from {repo} and saved as weapon_model.pt")
        sys.exit(0)
    except Exception as e:
        print(f"Failed to download from {repo}: {e}")

print("Could not download any weapon model.")
sys.exit(1)
