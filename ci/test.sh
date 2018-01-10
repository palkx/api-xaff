#!/bin/bash

npm run test
bash <(curl -s https://codecov.io/bash)
