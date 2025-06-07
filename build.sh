#!/bin/bash
echo "🔨 Building Hotel Management System..."

# Create build directory
mkdir -p build/dist

# Copy production files
echo "📦 Copying files for production..."
cp -r hotel-manager build/dist/
cp -r admin build/dist/
cp -r shared build/dist/
cp -r api build/dist/
cp -r config build/dist/
cp index.html build/dist/

# Minify CSS and JS files (if tools available)
if command -v uglifyjs &> /dev/null; then
    echo "🗜️ Minifying JavaScript files..."
    find build/dist -name "*.js" -exec uglifyjs {} -o {} \;
fi

if command -v cleancss &> /dev/null; then
    echo "🗜️ Minifying CSS files..."
    find build/dist -name "*.css" -exec cleancss {} -o {} \;
fi

echo "✅ Build completed! Files are in build/dist/"
