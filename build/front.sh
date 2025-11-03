cd app
elm make src/Main.elm --output=static/_c/main.js

cp -r ./static/ ../server/_static
