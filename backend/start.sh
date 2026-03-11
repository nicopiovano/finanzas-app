cat > start.sh << 'EOF'
#!/bin/sh
test -f .env || cp .env.example .env
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force
php artisan serve --no-reload --host=0.0.0.0 --port=10000
EOF
chmod +x start.sh