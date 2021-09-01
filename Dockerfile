FROM python:3.7.11-bullseye

RUN apt-get update

# Install Souffle dependencies

RUN apt-get install -y bison build-essential clang cmake doxygen flex g++ git libffi-dev libncurses5-dev libsqlite3-dev make mcpp sqlite3 zlib1g-dev bash-completion lsb-release

# Clone and build souffle

RUN git clone https://github.com/souffle-lang/souffle.git; \
    cd souffle; \
    cmake -S . -B build; \
    cmake --build build -j"$(grep -c ^processor /proc/cpuinfo)" --target install;

# Install packages we need
RUN apt-get install -y perl

# Cleanup

RUN rm -rf souffle; \
    apt-get purge -y bison build-essential clang cmake doxygen flex g++ git make mcpp; \
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
