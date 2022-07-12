#!/bin/bash

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2
ENV=$3

npm ci
npm i serverless -g
serverless package --stage=${ENV} --package=output
ls -a
echo environment ${ENV}
serverless deploy --stage=${ENV} --region=us-east-1 --package=output

