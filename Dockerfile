FROM ubuntu:20.04
RUN apt-get update && apt-get install -y wget lib32gcc-s1 lib32stdc++6
WORKDIR /server
RUN wget https://assets.open.mp/release/open.mp-linux-x86.tar.gz -O server.tar.gz && tar -xzf server.tar.gz
WORKDIR /server/Server
EXPOSE 7777/udp
CMD ["./omp-server"]
