#! /bin/sh

if ! test -d "build" ; then
  mkdir build
fi

JSSTRIP="python build/jsstrip.py -fwq"
YUICOMP="java -jar build/yuicompressor-2.4.2.jar"

cat compat/array.js \
    compat/core.js \
    compat/element/dom.js \
    compat/element/event.js \
    compat/element/element.js \
    compat/selectors/classname.js \
    compat/selectors/sly.js \
    compat/xmlhttprequest.js \
    compat/json2.js \
    > build/compat.tmp.js

cat addons/object.js \
    addons/array.js \
    addons/function.js \
    addons/string.js \
    addons/element.js \
    addons/classname.js \
    addons/color.js \
    addons/style.js \
    addons/ajax.js \
    > build/addons.tmp.js

cat ui/ui.js \
    ui/overlay.js \
    ui/window.js \
    ui/dialog.js \
    ui/picker.js \
    ui/tooltip.js \
    ui/notification.js \
    ui/autocompleter.js \
    ui/date_picker.js \
    > build/ui.tmp.js

cat html5/html5.js \
    html5/placeholder.js \
    > build/html5.tmp.js

echo "Minifying..."
$JSSTRIP build/compat.tmp.js > build/compat.js
$JSSTRIP build/addons.tmp.js > build/addons.js
$JSSTRIP build/ui.tmp.js     > build/ui.js
$JSSTRIP build/html5.tmp.js  > build/html5.js

echo "Compressing..."
$YUICOMP build/compat.tmp.js > build/compat-compressed.js
$YUICOMP build/addons.tmp.js > build/addons-compressed.js
$YUICOMP build/ui.tmp.js     > build/ui-compressed.js
$YUICOMP build/html5.tmp.js  > build/html5-compressed.js

#echo "Gzipping..."
#gzip -c build/compat-compressed.js > build/compat-compressed.js.gz
#gzip -c build/addons-compressed.js > build/addons-compressed.js.gz
#gzip -c build/ui-compressed.js     > build/ui-compressed.js.gz
#gzip -c build/html5-compressed.js  > build/html5-compressed.js.gz

rm build/compat.tmp.js > build/compat.tmp.js
rm build/addons.tmp.js > build/addons.tmp.js
rm build/ui.tmp.js     > build/ui.tmp.js
rm build/html5.tmp.js  > build/html5.tmp.js

