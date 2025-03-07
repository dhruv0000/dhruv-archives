.PHONY: build serve clean submodule install

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

install:
	@echo "Installing Hugo and initializing git repository"
	@command -v hugo >/dev/null 2>&1 || brew install hugo
	@if [ ! -d .git ]; then \
		git init; \
		git remote add origin https://github.com/dhruv0000/dhruv-archives.git; \
	else \
		echo "Git repository already initialized"; \
	fi
	@git fetch origin || true
