FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

