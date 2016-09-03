#!/bin/bash

RISKFACTOR_DIR="/Users/Sachin/code/jobs/riskfactor/riskfactor-app"
RISKFACTOR_APK_DIR="$RISKFACTOR_DIR/platforms/android/build/outputs/apk"

echo "$RISKFACTOR_APK_DIR/android-release-signed.apk"
if [ -f "$RISKFACTOR_APK_DIR/android-release-signed.apk" ]
then
  rm "$RISKFACTOR_APK_DIR/android-release-signed.apk"
fi

if  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$RISKFACTOR_DIR/my-release-key.keystore" "$RISKFACTOR_APK_DIR/android-release-unsigned.apk" alias_name
then
  if zipalign -v 4 "$RISKFACTOR_APK_DIR/android-release-unsigned.apk" "$RISKFACTOR_APK_DIR/android-release-signed.apk"
  then
    cp "$RISKFACTOR_APK_DIR/android-release-signed.apk" ~/Dropbox/uThought/
  fi
fi


# keytool -keystore my-release-key.keystore -list -v
