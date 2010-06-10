
JSSTRIP = python build/jsstrip.py -fwq
YUICOMP = java -jar build/yuicompressor-2.4.2.jar

TMPALPHA  = build/alpha.tmp.js
TMPADDONS = build/alpha-addons.tmp.js
TMPUJS    = build/alpha-ujs.tmp.js
TMPHTML5  = build/alpha-html5.tmp.js
TMPUI     = build/alpha-ui.tmp.js

all: alpha alpha-addons alpha-ujs alpha-html5 alpha-ui

clean:
	rm -f build/*.js

alpha:        minify-alpha  compress-alpha  cleanup-alpha
alpha-addons: minify-addons compress-addons cleanup-addons
alpha-ujs:    minify-ujs    compress-ujs    cleanup-ujs
alpha-html5:  minify-html5  compress-html5  cleanup-html5
alpha-ui:     minify-ui     compress-ui     cleanup-ui


minify-alpha: tmp-alpha
	$(JSSTRIP) $(TMPALPHA) > build/alpha.js

compress-alpha: tmp-alpha
	$(YUICOMP) $(TMPALPHA) > build/alpha-compressed.js

tmp-alpha:
	cat lib/alpha/array.js lib/alpha/string.js lib/alpha/core.js \
		lib/alpha/dom/dom.js lib/alpha/dom/elements.js \
		lib/alpha/dom/events.js lib/alpha/dom/window.js \
		lib/alpha/selectors/sly.js lib/alpha/selectors/classname.js \
		lib/alpha/xmlhttprequest.js lib/alpha/json2.js \
		> $(TMPALPHA)

cleanup-alpha:
	rm -f $(TMPALPHA)


minify-addons: tmp-addons
	$(JSSTRIP) $(TMPADDONS) > build/alpha-addons.js

compress-addons: tmp-addons
	$(YUICOMP) $(TMPADDONS) > build/alpha-addons-compressed.js

tmp-addons:
	cat lib/addons/merge.js lib/addons/function.js \
	  lib/addons/string.js lib/addons/classname.js \
	  lib/addons/color.js lib/addons/style.js \
		lib/addons/serializer.js > $(TMPADDONS)

cleanup-addons:
	rm -f $(TMPADDONS)


minify-ujs: tmp-ujs
	$(JSSTRIP) $(TMPUJS) > build/alpha-ujs.js

compress-ujs: tmp-ujs
	$(YUICOMP) $(TMPUJS) > build/alpha-ujs-compressed.js

tmp-ujs:
	cat lib/ujs/rails.js > $(TMPUJS)

cleanup-ujs:
	rm -f $(TMPUJS)


minify-html5: tmp-html5
	$(JSSTRIP) $(TMPHTML5) > build/alpha-html5.js

compress-html5: tmp-html5
	$(YUICOMP) $(TMPHTML5) > build/alpha-html5-compressed.js

tmp-html5:
	cat lib/html5/html5.js lib/html5/placeholder.js \
		lib/html5/details.js > $(TMPHTML5)

cleanup-html5:
	rm -f $(TMPHTML5)


minify-ui: tmp-ui
	$(JSSTRIP) $(TMPUI) > build/alpha-ui.js

compress-ui: tmp-ui
	$(YUICOMP) $(TMPUI) > build/alpha-ui-compressed.js

tmp-ui:
	cat lib/ui/ui.js \
		lib/ui/overlay.js lib/ui/window.js lib/ui/dialog.js \
		lib/ui/picker.js lib/ui/tooltip.js lib/ui/notification.js \
		lib/ui/autocompleter.js lib/ui/date_picker.js \
		lib/ui/autoresize.js lib/ui/in_place_editor.js > $(TMPUI)

cleanup-ui:
	rm -f $(TMPUI)

