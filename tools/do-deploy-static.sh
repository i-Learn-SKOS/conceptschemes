#!/bin/bash
# Deploy static files delivered by this project
# To be executed on a clone of this project on the server
# You'll need to have sudo rights there

set -e

echo "=== Deploying static files"

# icons; see ../input/iconen/README.md
sudo mkdir -p /var/www/html/iconen
sudo cp ../input/iconen/*.svg /var/www/html/iconen/
sudo cp ../input/iconen/.htaccess /var/www/html/iconen/
sudo cp ../schemes/icons.ttl /var/www/html/iconen/
