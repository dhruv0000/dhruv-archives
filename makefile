.PHONY: build serve clean submodule remote

submodule:
	git submodule update --init --recursive
	git submodule status

build: submodule
	hugo --minify

serve:
	hugo server -D

clean:
	rm -rf public/
	rm -rf resources/
	rm -rf .hugo_build.lock

remote:
	git fetch --all
	git pull origin main
	git submodule foreach git fetch --all
	git submodule foreach git pull origin main
