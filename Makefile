FILES		= lib/base64.js lib/Z80.js \
		  index.html \
		  files.js video.js memmap.js \
		  hl4-memmap.js driver.js \
		  main.js
OUTFILES	= $(patsubst %, _build/%, $(FILES))

all: $(OUTFILES)

_build/files.js: data/hl4-rom.bin data/hl4-charset.bin
	mkdir -p _build
	(echo "let files = {"; \
	$(foreach file, $?, \
		printf "\t'%s': base64ToArrayBuffer('" $(file) ; \
		base64 $(file) | sed -e 's/$$/\\/' ; \
		printf "'),\n" ; \
		) \
	echo "};"; \
	) > $@

_build/index.html: html/index.html
	mkdir -p _build
	cp -f $< $@

_build/lib/base64.js: import/base64.js
	mkdir -p _build/lib
	cp -f $< $@

_build/%.js: src/%.js
	mkdir -p _build
	cp -f $< $@

_build/lib/Z80.js: import/Z80.js/Z80.js
	mkdir -p _build/lib
	cp -f $< $@
