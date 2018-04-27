#!/bin/bash

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/id_rsa # Allow read access to the private key
ssh-add .travis/id_rsa # Add the private key to SSH

scp -P $PORT config/* deploy@$IP:$CONFIG_DIR # Upload config files

# Skip this command if you don't need to execute any additional commands after deploying.
ssh deploy@$IP -p $PORT <<EOF
  rm -rf $TEMP_DEPLOY_DIR
  mkdir $TEMP_DEPLOY_DIR
  cd $TEMP_DEPLOY_DIR
  git clone -b production https://github.com/iSm1le/api-xaff.git .
  yarn
  yarn run build-prod
  rm -rf $DEPLOY_DIR/*
  cp -R dist/* $DEPLOY_DIR/
  pm2 restart api
EOF