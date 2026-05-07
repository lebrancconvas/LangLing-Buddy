# Run everything from the repository root (no `cd backend` / `cd frontend`).
# Usage:
#   make dev          — backend + frontend together
#   make backend      — API only (http://127.0.0.1:8000)
#   make frontend     — Next.js only (http://127.0.0.1:3000)

SHELL := /bin/bash

ROOT_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

.PHONY: help dev backend frontend

help:
	@echo "Targets:"
	@echo "  make dev       — run backend and frontend in parallel"
	@echo "  make backend   — FastAPI (backend/, port 8000)"
	@echo "  make frontend  — Next.js (frontend/, port 3000)"

# API: uses backend/venv and backend/Makefile
backend:
	$(MAKE) -C "$(ROOT_DIR)/backend" run

# Web app
frontend:
	npm --prefix "$(ROOT_DIR)/frontend" run dev

# Both services at once; Ctrl+C attempts to stop both child processes.
dev:
	@set -euo pipefail; \
	trap 'kill $$(jobs -p) 2>/dev/null || true' INT TERM EXIT; \
	$(MAKE) -C "$(ROOT_DIR)/backend" run & \
	npm --prefix "$(ROOT_DIR)/frontend" run dev & \
	wait
