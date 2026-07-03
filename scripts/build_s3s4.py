import subprocess
import buildtools

DESIGN_WIDTH = 466

buildtools.setManifestDesignWidth(DESIGN_WIDTH)

subprocess.run(["yarn", "run", "build"], check=True)