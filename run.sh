#!/usr/bin/env bash

docker build -t web-image:0.0.1 ./shop-page

docker run -p 80:80 web-image:0.0.1
