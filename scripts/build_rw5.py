import os
import buildtools

DESIGN_WIDTH = 432

buildtools.setManifestDesignWidth(DESIGN_WIDTH)

os.system("yarn run build")