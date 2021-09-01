FROM python:3.7.11-buster

RUN apt-get update

# Install Souffle dependencies

RUN apt-get install -y autoconf automake bison build-essential clang doxygen flex g++ git libncurses5-dev libtool libsqlite3-dev make mcpp sqlite zlib1g-dev

# Clone and build souffle

RUN git clone https://github.com/souffle-lang/souffle.git; \
    cd souffle; \
    ./bootstrap; \
    ./configure; \
    make -j"$(grep -c ^processor /proc/cpuinfo)"; \
    make install

# Install packages we need
RUN apt-get install -y perl

# Cleanup

RUN rm -rf souffle; \
    apt-get purge -y autoconf automake bison build-essential clang doxygen flex g++ git make mcpp; \
    apt-get autoremove -y

# Install fake mcpp to disable #include
COPY fake-mcpp.sh /bin/mcpp

# Copy over souffle-web files

RUN mkdir souffle-web
WORKDIR souffle-web

COPY third-party third-party
COPY server.py .
COPY doc/config.json config.json* ./

ENTRYPOINT ["python3", "-u", "server.py", "8123"]
