FROM node:18-slim
WORKDIR /app
COPY server.js .
EXPOSE 7777
CMD ["node", "server.js"]
