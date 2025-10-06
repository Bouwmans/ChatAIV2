import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type Event = {
  body?: string;
};

const client = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION ?? process.env.AWS_REGION ?? 'us-east-1',
});

export const handler = async (event: Event) => {
  try {
    if (!event.body) {
      return createResponse(400, { message: 'Missing request body' });
    }

    const payload = JSON.parse(event.body) as {
      history?: ChatMessage[];
      maxTokens?: number;
      temperature?: number;
    };

    const { history = [], maxTokens = 1024, temperature = 0.7 } = payload;

    if (history.length === 0) {
      return createResponse(400, { message: 'Conversation history is required.' });
    }

    const messages = history.map((message) => ({
      role: message.role,
      content: [
        {
          type: 'text',
          text: message.content,
        },
      ],
    }));

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID!,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const response = await client.send(command);
    const decoded = new TextDecoder('utf-8').decode(response.body);
    const result = JSON.parse(decoded) as {
      content?: Array<{ type: string; text: string }>;
      stop_reason?: string;
      id?: string;
      model?: string;
    };

    const reply = result.content?.find((chunk) => chunk.type === 'text')?.text ?? '';

    return createResponse(200, {
      reply,
      metadata: {
        stopReason: result.stop_reason,
        modelId: result.model,
      },
    });
  } catch (error) {
    console.error('Bedrock invocation failed', error);
    return createResponse(500, {
      message: 'Failed to invoke Bedrock model',
      error: (error as Error).message,
    });
  }
};

const createResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
  },
  body: JSON.stringify(body),
});
