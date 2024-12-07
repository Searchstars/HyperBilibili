import os
import buildtools

DESIGN_WIDTH = 192

buildtools.setManifestDesignWidth(DESIGN_WIDTH)

os.system("aiot release --enable-custom-component --enable-jsc --enable-protobuf --enable-image-png8")