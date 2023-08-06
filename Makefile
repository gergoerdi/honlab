DATAFILES = \
	hl2/rom.bin hl2/charset.bin \
	hl4/rom.bin hl4/charset.bin

FILES = \
	lib/base64.js lib/Z80.js \
	index.html index.css \
	files.js \
	driver.js \
	video.js keyboard.js memmap.js \
	hl2/video.js hl2/keyboard.js hl2/memmap.js \
	hl4/video.js hl4/keyboard.js hl4/memmap.js \
	main.js
OUTFILES = $(patsubst %, _build/%, $(FILES))

all: $(OUTFILES)

_build/files.js: $(patsubst %, data/%, $(DATAFILES))
	mkdir -p _build
	(echo "let files = {"; \
	$(foreach file, $^, \
		printf "\t'%s': base64ToArrayBuffer('" $(file) ; \
		base64 $(file) | sed -e 's/$$/\\/' ; \
		printf "'),\n" ; \
		) \
	echo "};"; \
	) > $@

_build/index.html: html/index.html
	mkdir -p _build
	cp -f $< $@

_build/index.css: html/index.css
	mkdir -p _build
	cp -f $< $@

_build/%.js: src/%.js
	mkdir -p $(dir $@)
	cp -f $< $@

_build/lib/base64.js: import/base64.js
	mkdir -p $(dir $@)
	cp -f $< $@

_build/lib/Z80.js: import/Z80.js/Z80.js
	mkdir -p $(dir $@)
	cp -f $< $@
