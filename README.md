# ChatAI V2 - AWS Amplify Application

A modern, ChatGPT-like interface built with AWS Amplify Gen 2, React, TypeScript, and Amazon Bedrock.

## Features

- 🤖 **AI Chat**: Powered by Amazon Bedrock Claude 3 Sonnet
- 🔐 **Authentication**: Secure user authentication with AWS Cognito
- 💾 **Data Storage**: GraphQL API with AWS AppSync for conversation persistence
- 🎨 **Modern UI**: Tesla/SpaceX-inspired dark theme with smooth animations
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time**: Instant message delivery and updates

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: AWS Amplify Gen 2
- **Authentication**: AWS Cognito
- **Database**: AWS AppSync (GraphQL)
- **AI**: Amazon Bedrock (Claude 3 Sonnet)
- **Functions**: AWS Lambda

## Getting Started

### Prerequisites

- Node.js 18+ 
- AWS CLI configured
- AWS Amplify CLI (`npm install -g @aws-amplify/cli`)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure AWS Amplify**:
   ```bash
   npx ampx sandbox
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Deploy to production**:
   ```bash
   npx ampx deploy
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatApp.tsx     # Main chat application
│   ├── ChatWindow.tsx  # Chat interface
│   ├── Sidebar.tsx     # Conversation sidebar
│   ├── MessageList.tsx # Message display
│   └── MessageInput.tsx # Message input
├── services/           # API services
├── types/             # TypeScript types
├── utils/             # Utility functions
└── App.tsx           # Main app component

amplify/
├── auth.ts           # Authentication configuration
├── data.ts           # GraphQL schema
├── backend.ts        # Backend configuration
└── bedrock-chat/    # Lambda function for Bedrock
```

## Configuration

### Environment Variables

The application uses AWS Amplify's built-in environment management. No manual configuration required.

### Bedrock Model

Currently configured to use `anthropic.claude-3-sonnet-20240229-v1:0`. To change the model, update the `BEDROCK_MODEL_ID` in `amplify/bedrock-chat.ts`.

## Features in Detail

### Authentication
- Email-based sign up and sign in
- Secure session management
- User-specific data isolation

### Chat Interface
- Multiple conversation support
- Real-time message delivery
- Markdown rendering for AI responses
- Message history persistence
- Auto-scroll to latest messages

### AI Integration
- Claude 3 Sonnet via Amazon Bedrock
- Conversation context preservation
- Error handling and fallbacks
- Token usage tracking

### UI/UX
- Dark theme with Tesla/SpaceX aesthetic
- Smooth animations with Framer Motion
- Responsive design
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Deployment

### Development
```bash
npm run dev
npx ampx sandbox
```

### Production
```bash
npm run build
npx ampx deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the AWS Amplify documentation
- Review the Amazon Bedrock documentation
- Open an issue in this repository
