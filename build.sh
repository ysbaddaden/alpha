#! /bin/sh

if ! test -d "build" ; then
  mkdir build
fi

JSSTRIP="python build/jsstrip.py -fwq"
YUICOMP="java -jar build/yuicompressor-2.4.2.jar"

cat lib/compat/array.js \
    lib/compat/core.js \
    lib/compat/element/dom.js \
    lib/compat/element/event.js \
    lib/compat/element/element.js \
    lib/compat/selectors/classname.js \
    lib/compat/selectors/sly.js \
    lib/compat/xmlhttprequest.js \
    lib/compat/json2.js \
    > build/compat.tmp.js

cat lib/addons/object.js \
    lib/addons/array.js \
    lib/addons/function.js \
    lib/addons/string.js \
    lib/addons/element.js \
    lib/addons/classname.js \
    lib/addons/color.js \
    lib/addons/style.js \
    lib/addons/ajax.js \
    > build/addons.tmp.js

cat lib/ui/ui.js \
    lib/ui/overlay.js \
    lib/ui/window.js \
    lib/ui/dialog.js \
    lib/ui/picker.js \
    lib/ui/tooltip.js \
    lib/ui/notification.js \
    lib/ui/autocompleter.js \
    lib/ui/date_picker.js \
    lib/ui/autoresize.js \
    lib/ui/in_place_editor.js \
    > build/ui.tmp.js

cat lib/html5/html5.js \
    lib/html5/placeholder.js \
    lib/html5/details.js \
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

