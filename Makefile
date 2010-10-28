#JSSTRIP = python build/jsstrip.py -fwq
YUICOMP = java -jar build/yuicompressor-2.4.2.jar

CORE_FILES=lib/alpha/array.js \
	lib/alpha/string.js \
	lib/alpha/core.js \
	lib/alpha/dom/dom.js \
	lib/alpha/dom/elements.js \
	lib/alpha/dom/events.js \
	lib/alpha/dom/window.js \
	lib/alpha/selectors/sly.js \
	lib/alpha/selectors/classname.js \
	lib/alpha/xmlhttprequest.js \
	lib/alpha/json2.js

ADDONS_FILES=lib/addons/merge.js \
	lib/addons/function.js \
	lib/addons/string.js \
	lib/addons/element.js \
	lib/addons/classname.js \
	lib/addons/style.js \
	lib/addons/color.js \
	lib/addons/serializer.js

UI_FILES=lib/ui/ui.js \
		lib/ui/overlay.js \
		lib/ui/window.js \
		lib/ui/dialog.js \
		lib/ui/picker.js \
		lib/ui/tooltip.js \
		lib/ui/notification.js \
		lib/ui/list_picker.js \
		lib/ui/date_picker.js \
		lib/ui/color_picker.js \
		lib/ui/autocompleter.js \
		lib/ui/datalist_autocompleter.js \
		lib/ui/autoresize.js \
		lib/ui/in_place_editor.js

HTML5_FILES=lib/html5/html5.js \
	lib/html5/placeholder.js \
	lib/html5/details.js \
	lib/html5/datalist.js

all: alpha alpha-ujs

alpha: alpha-core alpha-addons alpha-ui alpha-html5
	cat build/alpha-core.js build/alpha-addons.js \
		build/alpha-ui.js build/alpha-html5.js > build/alpha.js
	$(YUICOMP) build/alpha.js > build/alpha-compressed.js

alpha-core:
	cat $(CORE_FILES) > build/alpha-core.js
	$(YUICOMP) build/alpha-core.js > build/alpha-core-compressed.js

alpha-addons:
	cat $(ADDONS_FILES) > build/alpha-addons.js
	$(YUICOMP) build/alpha-addons.js > build/alpha-addons-compressed.js

alpha-html5:
	cat $(HTML5_FILES) > build/alpha-html5.js
	$(YUICOMP) build/alpha-html5.js > build/alpha-html5-compressed.js

alpha-ui:
	cat $(UI_FILES) > build/alpha-ui.js
	$(YUICOMP) build/alpha-ui.js > build/alpha-ui-compressed.js

alpha-ujs:
	cat lib/ujs/rails.js > build/alpha-ujs.js
	$(YUICOMP) build/alpha-ujs.js > build/alpha-ujs-compressed.js

clean:
	rm -f build/*.js

