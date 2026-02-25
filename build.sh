#!/bin/bash
# Build script for deployment
# This creates load-env.js from environment variable

echo "Building for deployment..."

# Create load-env.js with the API key from environment variable
cat > load-env.js << EOF
// Auto-generated during deployment
window.OPENWEATHER_API_KEY = "${OPENWEATHER_API_KEY}";
EOF

echo "Build complete! load-env.js created."
