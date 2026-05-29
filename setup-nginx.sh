#!/bin/bash
DOMAIN="boogertime.xyz"
WEBROOT="/var/www"

mkdir -p "$WEBROOT/$DOMAIN"
mkdir -p "$WEBROOT/api.$DOMAIN"
mkdir -p "$WEBROOT/booger.$DOMAIN"
mkdir -p "$WEBROOT/dash.$DOMAIN"
mkdir -p "$WEBROOT/www.$DOMAIN"

echo "<h1>boogertime.xyz</h1>" > "$WEBROOT/$DOMAIN/index.html"
echo "<h1>api.boogertime.xyz</h1>" > "$WEBROOT/api.$DOMAIN/index.html"
echo "<h1>booger.boogertime.xyz</h1>" > "$WEBROOT/booger.$DOMAIN/index.html"
echo "<h1>dash.boogertime.xyz</h1>" > "$WEBROOT/dash.$DOMAIN/index.html"
echo "<h1>www.boogertime.xyz</h1>" > "$WEBROOT/www.$DOMAIN/index.html"

cat > /etc/nginx/sites-available/boogertime.xyz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name boogertime.xyz;
    root /var/www/boogertime.xyz;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
EOF

cat > /etc/nginx/sites-available/api.boogertime.xyz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.boogertime.xyz;
    root /var/www/api.boogertime.xyz;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
EOF

cat > /etc/nginx/sites-available/booger.boogertime.xyz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name booger.boogertime.xyz;
    root /var/www/booger.boogertime.xyz;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
EOF

cat > /etc/nginx/sites-available/dash.boogertime.xyz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name dash.boogertime.xyz;
    root /var/www/dash.boogertime.xyz;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
EOF

cat > /etc/nginx/sites-available/www.boogertime.xyz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name www.boogertime.xyz;
    return 301 http://boogertime.xyz$request_uri;
}
EOF

ln -sf /etc/nginx/sites-available/boogertime.xyz /etc/nginx/sites-enabled/boogertime.xyz
ln -sf /etc/nginx/sites-available/api.boogertime.xyz /etc/nginx/sites-enabled/api.boogertime.xyz
ln -sf /etc/nginx/sites-available/booger.boogertime.xyz /etc/nginx/sites-enabled/booger.boogertime.xyz
ln -sf /etc/nginx/sites-available/dash.boogertime.xyz /etc/nginx/sites-enabled/dash.boogertime.xyz
ln -sf /etc/nginx/sites-available/www.boogertime.xyz /etc/nginx/sites-enabled/www.boogertime.xyz

nginx -t && systemctl reload nginx
echo "Done!"
