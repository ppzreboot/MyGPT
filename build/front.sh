cd client
npm run build

mkdir -p ../server/_static
cp -r ./dist/* ../server/_static
