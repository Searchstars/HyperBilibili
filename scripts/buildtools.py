import json
import subprocess
from datetime import datetime

def setManifestDesignWidth(width):
    manifest = readFileToJson("src/manifest.json")
    manifest["config"]["designWidth"] = width
    writeJsonToFile("src/manifest.json", manifest)

def getGitCommitHash():
    try:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            commit_hash = result.stdout.strip()[:7]
            return commit_hash
        else:
            print("Failed to get commit hash. Make sure you are in a Git repository.")
            Exception(f"Error: {result.stderr}")
    except Exception as e:
        print(f"An error occurred: {e}")

def getBuildTime():
    now = datetime.now()
    formatted_datetime = now.strftime("%Y.%m.%d %H:%M")
    return formatted_datetime

def readFileToJson(path):
    f = open(path, "r")
    f = f.read()
    f = json.loads(f)
    return f

def writeJsonToFile(path, obj):
    with open(path, "w+", encoding="utf-8") as f:
        write_str = json.dumps(obj, ensure_ascii=False, indent=4)
        f.write(write_str)