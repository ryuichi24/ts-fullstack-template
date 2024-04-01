#!/bin/bash

usage() {
    cat <<EOM

Description:
    Make all neccessary logo icons from one 512x512px png file.

Example usage:
    ./make-logo-icons.sh ./example.png

EOM
    exit 0
}

[ -z $1 ] && { usage; }

if ! which convert &>/dev/null; then
    echo "'imagemagick' is not installed."
    echo "Do you want to install 'imagemagick'?"
    select yn in "Yes" "No"; do
        case $yn in
        "Yes")
            brew install imagemagick
            break
            ;;
        "No")
            echo "The process was terminated."
            exit
            ;;
        esac
    done
fi

# Path to the source image file (512x512px)
readonly SOURCE_IMAGE=$1

# Path to the directory to save the generated windows icon
readonly WINDOWS_ICON_DIR='./out/logo/windows'

# Path to the directory to save the generated windows icon
readonly MAC_ICON_DIR='./out/logo/mac'

# Path to the directory to save the linux icon
readonly LINUX_ICON_DIR='./out/logo/linux'

# Path to the directory to save the generated icon sets
readonly ICONSET_DIR='out/logo.iconset'

# Check if the source file exists
if [ ! -f $SOURCE_IMAGE ]; then
    echo "$SOURCE_IMAGE is not found."
    exit
fi

mkdir -p $ICONSET_DIR
mkdir -p $WINDOWS_ICON_DIR
mkdir -p $MAC_ICON_DIR
mkdir -p $LINUX_ICON_DIR

# Resize the source image for each necessary size
# https://www.imagemagick.org/script/command-line-options.php#resize
convert -resize 16x16! $SOURCE_IMAGE $ICONSET_DIR/icon_16x16.png
convert -resize 32x32! $SOURCE_IMAGE $ICONSET_DIR/icon_16x16@2x.png
convert -resize 32x32! $SOURCE_IMAGE $ICONSET_DIR/icon_32x32.png
convert -resize 64x64! $SOURCE_IMAGE $ICONSET_DIR/icon_32x32@2x.png
convert -resize 128x128! $SOURCE_IMAGE $ICONSET_DIR/icon_128x128.png
convert -resize 256x256! $SOURCE_IMAGE $ICONSET_DIR/icon_128x128@2x.png
convert -resize 256x256! $SOURCE_IMAGE $ICONSET_DIR/icon_256x256.png
convert -resize 512x512! $SOURCE_IMAGE $ICONSET_DIR/icon_256x256@2x.png
convert -resize 512x512! $SOURCE_IMAGE $ICONSET_DIR/icon_512x512.png

# Generate mac icon
iconutil -c icns $ICONSET_DIR -o $MAC_ICON_DIR/logo.icns

# Generate windows icon
# https://www.imagemagick.org/script/defines.php
convert $SOURCE_IMAGE -define icon:auto-resize $WINDOWS_ICON_DIR/logo.ico

# Generate linux icon
mv $SOURCE_IMAGE $LINUX_ICON_DIR/logo.png
