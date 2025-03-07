.PHONY: build serve clean submodule

submodule:
	git submodule update --init --recursive
	git submodule status

build: submodule
	hugo

serve:
	hugo server -D

clean:
	rm -rf public/
	rm -rf resources/
	rm -rf .hugo_build.lock

remote: submodule
	git checkout main
	git fetch --all
	git pull origin main
	git submodule foreach git checkout main
	git submodule foreach git fetch --all
	git submodule foreach git pull origin main
