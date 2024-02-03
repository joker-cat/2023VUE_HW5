#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://joker-cat.github.io
# git push -f git@github.com:joker-cat/joker-cat.github.io.git main

# if you are deploying to https://joker-cat.github.io/2023VUE_HW4
git push -f https://github.com/joker-cat/2023VUE_HW5.git main:gh-pages

cd -