import os
import shutil

brain_dir = r"C:\Users\Stric\.gemini\antigravity\brain\d279e5b0-5909-4eac-a69d-55b86b94f81b"
dest_dir = r"c:\Users\Stric\OneDrive\Documents\AntiGravity\Gibbs Review Gate Page\assets"

os.makedirs(dest_dir, exist_ok=True)

logo_src = os.path.join(brain_dir, "media__1785183974335.png")
site_src = os.path.join(brain_dir, "media__1785183974364.png")

if os.path.exists(logo_src):
    shutil.copy(logo_src, os.path.join(dest_dir, "logo.png"))
    print("Logo copied successfully to assets/logo.png")

if os.path.exists(site_src):
    shutil.copy(site_src, os.path.join(dest_dir, "header_reference.png"))
    print("Header reference copied successfully to assets/header_reference.png")
