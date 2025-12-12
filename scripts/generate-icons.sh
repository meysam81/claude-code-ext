#!/bin/bash
# Generate PNG icons from SVG
# Requires: Inkscape or ImageMagick with SVG support

SIZES="16 32 48 128"
SVG_FILE="public/icons/icon.svg"
OUTPUT_DIR="public/icons"

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
  for size in $SIZES; do
    convert -background none -resize "${size}x${size}" "$SVG_FILE" "$OUTPUT_DIR/icon-${size}.png"
    echo "Generated icon-${size}.png"
  done
  echo "Icons generated successfully!"
elif command -v inkscape &> /dev/null; then
  for size in $SIZES; do
    inkscape -w "$size" -h "$size" "$SVG_FILE" -o "$OUTPUT_DIR/icon-${size}.png"
    echo "Generated icon-${size}.png"
  done
  echo "Icons generated successfully!"
else
  echo "Please install ImageMagick or Inkscape to generate icons"
  echo "Or manually export the SVG to PNG at sizes: $SIZES"
  exit 1
fi
