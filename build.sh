#! /bin/sh

if ! test -d "build" ; then
  mkdir build
fi

cat compat/array.js \
    compat/core.js \
    compat/element.js \
    compat/events.js \
    compat/selectors.js \
    compat/xmlhttprequest.js \
    compat/json2.js \
    > build/compat.js

cat addons/object.js \
    addons/array.js \
    addons/function.js \
    addons/string.js \
    addons/element.js \
    addons/classname.js \
    addons/style.js \
    addons/ajax.js \
    > build/addons.js

cat ui/ui.js \
    ui/overlay.js \
    ui/window.js \
    ui/dialog.js \
    ui/picker.js \
    ui/notification.js \
    ui/autocompleter.js \
    > build/ui.js

java -jar build/yuicompressor-2.4.2.jar build/compat.js -o build/compat-compressed.js --type js --charset utf-8
java -jar build/yuicompressor-2.4.2.jar build/addons.js -o build/addons-compressed.js --type js --charset utf-8
java -jar build/yuicompressor-2.4.2.jar build/ui.js     -o build/ui-compressed.js     --type js --charset utf-8

