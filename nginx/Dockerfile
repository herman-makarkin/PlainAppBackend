# Use an official Nginx image as the base
FROM nginx:alpine

# Copy your custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that Nginx will listen on
EXPOSE 80

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "nginx", "-g", "daemon off;" ]
