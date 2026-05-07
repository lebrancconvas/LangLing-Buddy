VENV ?= venv
PYTHON := $(VENV)/bin/python
UVICORN := $(VENV)/bin/uvicorn

.PHONY: run shell

# Run commands using the venv (no manual `source` needed).
run:
	$(UVICORN) app.main:app --reload --port 8000

# Open an interactive shell with venv activated (Make cannot activate your current shell).
shell:
	@test -f "$(VENV)/bin/activate" || { echo "Missing $(VENV)/bin/activate — create the venv first."; exit 1; }
	. "$(VENV)/bin/activate" && exec "$$SHELL"
