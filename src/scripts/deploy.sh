#!/bin/bash

export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2
ENV=$3

ls -a

npm ci
serverless deploy --stage ${ENV} --region us-east-1 

