#!/bin/sh
cd '/Users/hiconnor/Desktop/MOSO WEB/moso-marketing'
export PATH=/Users/hiconnor/.nvm/versions/node/v20.20.2/bin:$PATH
exec node node_modules/.bin/next dev --turbopack
