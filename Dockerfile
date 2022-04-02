FROM mhart/alpine-node:14
WORKDIR /usr/server
COPY . .
RUN npm ci --only=production
EXPOSE 7000
EXPOSE 7001
CMD ["node", "server.js"]
