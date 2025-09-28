#!/bin/bash

# ChatAI V2 Deployment Script
# This script sets up and deploys the AWS Amplify application

echo "🚀 Starting ChatAI V2 deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v ampx &> /dev/null; then
    echo "❌ AWS Amplify CLI is not installed. Installing..."
    npm install -g @aws-amplify/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Amplify sandbox for development
echo "🏗️ Starting Amplify sandbox..."
npx ampx sandbox --once

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to production
echo "🚀 Deploying to production..."
npx ampx deploy

echo "✅ Deployment complete!"
echo "🌐 Your application is now live!"
