.PHONY: build serve clean submodule install remote

submodule:
	git submodule update --init --recursive --remote
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
	@echo "Updating the repository and submodules"
	git fetch --all
	git pull origin main
	git submodule foreach git fetch --all
	git submodule foreach git pull origin main

submodule-head-to-main:
		git submodule foreach git reset --hard origin/main
