#!/bin/bash

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2
ENV=$3


npm i serverless -g
ls -a
echo ${ENV}
serverless deploy --stage=${ENV} --region=us-east-1 

