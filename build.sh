#! /bin/sh

cat compat/array.js \
    compat/core.js \
    compat/element.js \
    compat/events.js \
    compat/selectors.js \
    compat/xmlhttprequest.js \
    > compat.js

cat addons/array.js \
    addons/function.js \
    addons/string.js \
    addons/element.js \
    addons/classname.js \
    addons/style.js \
    addons/ajax.js \
    > addons.js

cat ui/ui.js \
    ui/overlay.js \
    ui/window.js \
    ui/dialog.js \
    ui/picker.js \
    ui/notification.js \
    > ui.js

