#!/usr/bin/env bash

set -euo pipefail

if (( $(echo "$BASH_VERSION" | cut -f1 -d.) < 5 )); then
	echo "Bash 5 or newer required. If you're on macOS, the built-in Bash is too old; install a newer one from Homebrew."
	exit 1
fi

# Install dependencies
npm ci

# Clean all release and build artifacts
npm run build:clean

# Check authors
npm run authors:check

# Build & lint
npm run build
npm run lint
