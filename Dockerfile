FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y wget curl lib32gcc-s1 lib32stdc++6
WORKDIR /server
RUN LATEST=$(curl -s https://api.github.com/repos/openmultiplayer/open.mp/releases/latest | grep -o '"tag_name": "[^"]*"' | cut -d'"' -f4) \
    && echo "Descargando version: $LATEST" \
    && wget "https://github.com/openmultiplayer/open.mp/releases/download/${LATEST}/open.mp-linux-x86.tar.gz" -O server.tar.gz \
    && tar -xzf server.tar.gz \
    && rm server.tar.gz
WORKDIR /server/Server
EXPOSE 7777/udp
CMD ["./omp-server"]
