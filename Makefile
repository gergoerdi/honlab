FILES		= files.js index.html base64.js Z80.js main.js 
OUTFILES	= $(patsubst %, _build/%, $(FILES))

all: $(OUTFILES)

_build/files.js: data/hl3-4-32k.bin
	mkdir -p _build
	(echo "let files = {"; \
	$(foreach file, $<, \
		printf "\t'%s': base64ToArrayBuffer('" $(file) ; \
		base64 $(file) | sed -e 's/$$/\\/' ; \
		printf "'),\n" ; \
		) \
	echo "};"; \
	) > $@

_build/index.html: html/index.html
	mkdir -p _build
	cp -f $< $@

_build/base64.js: import/base64.js
	mkdir -p _build
	cp -f $< $@

_build/main.js: src/main.js
	mkdir -p _build
	cp -f $< $@

_build/Z80.js: import/Z80.js/Z80.js
	mkdir -p _build
	cp -f $< $@
