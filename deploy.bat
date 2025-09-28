@echo off
REM ChatAI V2 Deployment Script for Windows
REM This script sets up and deploys the AWS Amplify application

echo 🚀 Starting ChatAI V2 deployment...

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Check if Amplify CLI is installed
where ampx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ AWS Amplify CLI is not installed. Installing...
    npm install -g @aws-amplify/cli
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Start Amplify sandbox for development
echo 🏗️ Starting Amplify sandbox...
npx ampx sandbox --once

REM Build the application
echo 🔨 Building application...
npm run build

REM Deploy to production
echo 🚀 Deploying to production...
npx ampx deploy

echo ✅ Deployment complete!
echo 🌐 Your application is now live!
