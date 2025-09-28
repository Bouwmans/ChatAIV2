import { Amplify } from 'aws-amplify';
// Note: amplify_outputs.json will be generated when you run `npx ampx sandbox`
// For now, we'll use a placeholder configuration
const outputs = {
  version: '1',
  auth: {
    user_pool_id: 'us-east-1_123456789',
    user_pool_client_id: '12345678901234567890123456789012',
    identity_pool_id: 'us-east-1:12345678-1234-1234-1234-123456789012',
    aws_region: 'us-east-1',
  },
  data: {
    aws_region: 'us-east-1',
    url: 'https://1234567890.appsync-api.us-east-1.amazonaws.com/graphql',
    default_authorization_type: 'AMAZON_COGNITO_USER_POOLS',
    api_key: 'da2-1234567890',
  },
};

Amplify.configure(outputs);

export default Amplify;
