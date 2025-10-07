// amplify/functions/chatbedrock/handler.ts
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';  // Installed.
import type { BedrockRuntimeClientConfig } from '@aws-sdk/client-bedrock-runtime';

/**
 * Lambda handler: Called by GraphQL mutation with { arguments: { message: string } }.
 * - Calls Claude via Bedrock Messages API (chat format).
 * - Returns { reply: string }—Amplify extracts for mutation result.
 * - Why no streaming? Basic prototype; add later for real-time.
 * - Errors: Simple catch/return (no fancy types).
 */
export const handler = async (event: { arguments: { message: string } }): Promise<{ reply: string }> => {
  const { message } = event.arguments;
  if (!message) {
    return { reply: 'Error: Message required' };
  }

  // Client config: Uses Lambda's IAM role (with our policy) + env region.
  const config: BedrockRuntimeClientConfig = { region: process.env.AWS_REGION || 'us-east-1' };
  const client = new BedrockRuntimeClient(config);

  // Claude Messages API payload (supports history later).
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 500,
    temperature: 0.7,
    messages: [{ role: 'user', content: [{ type: 'text', text: message }] }],
  });

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID!,  // From env (set in resource.ts).
    body,
    contentType: 'application/json',
    accept: 'application/json',
  });

  try {
    const response = await client.send(command);
    // Fixed: Bedrock output uses 'body' (Uint8Array/blob); decode as array.
    const responseBody = new TextDecoder().decode(new Uint8Array(response.body as Uint8Array));
    const parsed = JSON.parse(responseBody);
    const reply = parsed.content?.[0]?.text || 'No reply from Claude.';
    return { reply };
  } catch (error) {
    console.error('Bedrock error:', error);
    return { reply: 'Error: Failed to chat with AI. Check Bedrock access.' };
  }
};