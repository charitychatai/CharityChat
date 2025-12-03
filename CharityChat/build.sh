#!/bin/bash
# Build script for Vercel - copies static files to output directory
echo "Building static site..."
# Files are already at root, just ensure they're accessible
ls -la *.html *.js *.css *.svg *.png *.txt 2>/dev/null || true
echo "Build complete - static files ready"

