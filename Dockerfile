FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y wget unzip lib32gcc-s1 lib32stdc++6
WORKDIR /server
RUN wget https://github.com/openmultiplayer/open.mp/releases/download/v1.3.0.2748/open.mp-linux-x86.tar.gz -O server.tar.gz \
    && tar -xzf server.tar.gz \
    && rm server.tar.gz
WORKDIR /server/Server
EXPOSE 7777/udp
CMD ["./omp-server"]
