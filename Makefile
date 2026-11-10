.PHONY: help install run build clean ready lint check citations nav labels seo serve dev stop deploy

# uv run fails to canonicalise script paths on this machine, so we call the
# venv interpreter directly. Works on Windows and POSIX venv layouts.
PY := $(shell if [ -x .venv/Scripts/python.exe ]; then echo .venv/Scripts/python.exe; else echo .venv/bin/python; fi)

help:
	@echo "Zeekr Insiders Australia Wiki"
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:
	@echo "Installing dependencies..."
	uv sync
	@echo "✅ Dependencies installed"

run:
	@echo "Starting development server..."
	$(PY) -m mkdocs serve

serve: run 

dev:
	@echo "Starting development server (network accessible)..."
	$(PY) -m mkdocs serve --dev-addr 0.0.0.0:8000

build:
	@echo "Building static site..."
	$(PY) -m mkdocs build --strict
	@echo "✅ Site built successfully"

clean:
	@echo "Cleaning build directory..."
	rm -rf site/
	@echo "✅ Build directory cleaned"

# Linting and checking
lint:
	@echo "Checking markdown files..."
	@if command -v markdownlint >/dev/null 2>&1; then \
		find content -name "*.md" -exec markdownlint {} +; \
		echo "✅ Markdown linting complete"; \
	else \
		echo "markdownlint not installed. Install with: npm install -g markdownlint-cli" >&2; \
		exit 1; \
	fi

# Optional extras, not part of ready: they fail loudly when the tool is missing. The strict build covers internal links.
check: build
	@echo "Checking for broken internal links..."
	@if command -v htmlproofer >/dev/null 2>&1; then \
		htmlproofer site/ --disable-external; \
		echo "✅ Link checking complete"; \
	else \
		echo "htmlproofer not installed. Install with: gem install html-proofer" >&2; \
		exit 1; \
	fi

# Every citation superscript must reach its Sources entry and back (scripts/check_citations.py).
citations:
	@echo "Checking citations..."
	$(PY) scripts/check_citations.py site

# No nav section may swallow a titled index.md (scripts/check_nav.py).
nav:
	@echo "Checking nav..."
	$(PY) scripts/check_nav.py mkdocs.yml

# A page is called the same in its H1, the nav and the cards that link to it (scripts/check_labels.py).
labels:
	@echo "Checking labels..."
	$(PY) scripts/check_labels.py site mkdocs.yml

# Every page has a unique title and description, a canonical, lang en-AU and valid structured data (scripts/check_seo.py).
seo:
	@echo "Checking search metadata..."
	$(PY) scripts/check_seo.py site

ready: clean nav build citations labels seo
	@echo ""
	@echo "🎉 All checks passed! Ready for commit."
	@echo ""
	@echo "Next steps:"
	@echo "  - Review the built site in site/ directory"
	@echo "  - Test locally with 'make run'"
	@echo "  - Commit your changes"
	@echo "  - Open a pull request; merging to main publishes the site"

# Publishing is GitHub Actions' job (.github/workflows/deploy.yml): merging to main builds and deploys
# to wiki.zeekrinsiders.com.au. gh-deploy would push a gh-pages branch the Pages setup ignores.
deploy:
	@echo "No manual deploys: merge to main and GitHub Actions publishes the wiki."
	@exit 1

# Quick commands
quick-build:
	@echo "Quick building..."
	$(PY) -m mkdocs build
	@echo "✅ Quick build complete"

quick-check: quick-build
	@echo "✅ Quick check complete"

# Info commands
info:
	@echo "Zeekr Insiders Australia Wiki"
	@echo "========================================"
	@echo "Python version: $$(python --version 2>/dev/null || echo 'Not found')"
	@echo "UV version: $$(uv --version 2>/dev/null || echo 'Not found')"
	@echo "MkDocs version: $$($(PY) -m mkdocs --version 2>/dev/null || echo 'Not found')"
	@echo ""
	@echo "Project structure:"
	@echo "  content/     - Wiki content (markdown files)"
	@echo "  data/        - Glossary and Handover checklist data"
	@echo "  site/        - Built static site (generated)"
	@echo "  mkdocs.yml   - MkDocs configuration"
	@echo "  pyproject.toml - Python project configuration"
	@echo ""
	@echo "Key files:"
	@echo "  README.md    - Project overview and setup"
	@echo "  AGENTS.md    - How pages are written and checked"
	@echo "  Makefile     - This file!"

# Utility commands
update:
	@echo "Updating dependencies..."
	uv sync --upgrade
	@echo "✅ Dependencies updated"

requirements:
	@echo "Generating requirements.txt..."
	uv export --format requirements-txt --no-hashes --no-dev --output-file requirements.txt
	@echo "✅ requirements.txt generated"
