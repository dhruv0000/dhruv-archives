.PHONY: build serve clean submodule install remote publish submodule-head-to-main

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

publish:
	@echo "Publishing to publish branch"
	git checkout publish
	git merge main
	git push origin publish
	git checkout main

new-blog:
	@if [ -z "$(name)" ]; then echo "Usage: make new-blog name=your-post-name"; exit 1; fi
	hugo new blog/$(name).md

new-primer:
	@if [ -z "$(name)" ]; then echo "Usage: make new-primer name=your-post-name"; exit 1; fi
	hugo new primer/$(name).md

new-diary:
	@if [ -z "$(name)" ]; then echo "Usage: make new-diary name=your-post-name"; exit 1; fi
	hugo new diary/$(name).md

new-me:
	@if [ -z "$(name)" ]; then echo "Usage: make new-me name=your-post-name"; exit 1; fi
	hugo new me/$(name).md
