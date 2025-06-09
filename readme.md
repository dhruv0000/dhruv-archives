# Dhruv Archives

My personal website built with [Hugo](https://gohugo.io/), using the custom [hugo-dhruv-archives](https://github.com/dhruv0000/hugo-dhruv-archives-theme) theme.

Hosted for free using: [](https://vercel.com/)
Domain Name: [cloudfare Registry](https://www.cloudflare.com/en-in/products/registrar/)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/dhruv0000/dhruv-archives.git
   ```
2. Initialize and update the theme submodule using the Makefile:
   ```bash
   make submodule
   ```
   The theme lives in `themes/hugo-dhruv-archives` as a submodule. Run `make submodule-head-to-main` after updating to ensure it always follows the theme's `main` branch.

3. Install [Hugo](https://gohugo.io/) and Start the Hugo development server:
   ```bash
   hugo server -D
   ```

4. Visit `http://localhost:1313` to see the site.

## Adding Content

You can create new content using the Makefile commands:

```bash
make new-blog name=my-post
make new-primer name=my-note
make new-diary name=my-entry
make new-me name=about-me
```
### Makefile Commands
- **build**: build the site with minification.
- **serve**: run a development server.
- **clean**: remove generated files.
- **remote**: fetch updates for repo and submodules.
- **submodule-head-to-main**: ensure the theme submodule points to its main branch.
- **publish**: merge main into the publish branch.
- **new-blog**: create a blog post (`make new-blog name=my-post`).
- **new-primer**: create a primer note (`make new-primer name=my-note`).
- **new-diary**: create a diary entry (`make new-diary name=my-entry`).
- **new-me**: create a page under `content/me` (`make new-me name=about-me`).
### Content Folders
- **blog**: draft or public facing posts.
- **primer**: notes on tech stacks available via direct link only.
- **diary**: private posts for my eyes or selected users later.
- **me**: personal pages and experiments.



## License

The content of this project itself is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/), and the underlying source code used to format and display that content is licensed under the MIT license.

[![CC BY 4.0][cc-by-shield]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
