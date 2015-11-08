#!/usr/bin/env sh
#get the script's directory taking symlink into account
SOURCE="$0"
while [-h "$SOURCE"]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[$SOURCE != /*]] && SOURCE="$DIR/$SOURCE"
done
DIR="$(cd "$(dirname "$0")" && pwd)"
cd $DIR

#update the icon for the desktop file
#no relative icons? really?
BIN=<file_name>
DESKTOP="$BIN".desktop
mv ../"$DESKTOP" ../"$DESKTOP".bck
sed -e "s,Icon=.*,Icon=$PWD/lambda.png,g" ../"$DESKTOP".bck > ../"$DESKTOP"
rm ../"$DESKTOP".bck
chmod +x ../"$DESKTOP"

./"$BIN"
