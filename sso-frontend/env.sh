echo "window.env = {" > /usr/share/nginx/html/config.js
echo "  API_URL: \"$API_URL\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

exec nginx -g "daemon off;"
