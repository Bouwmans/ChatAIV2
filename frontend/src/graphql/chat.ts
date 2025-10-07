// frontend/src/graphql/chat.ts (updated with fixes)
import { generateClient } from 'aws-amplify/data';
import type { GraphQLResult } from 'aws-amplify/api';  // Import for type casting.

const client = generateClient();

/**
 * Mutation: Call our chat function.
 * - Use after auth (client auto-uses Cognito tokens).
 */
export const chatMutation = /* GraphQL */ `
  mutation Chat($message: String!) {
    chat(message: $message)
  }
`;

/**
 * Helper: Send message, get reply.
 */
export async function sendChatMessage(message: string): Promise<string> {
  const response = await client.graphql({
    query: chatMutation,
    variables: { message },
  }) as GraphQLResult<{ chat: string }>;  // Cast to mutation result type.
  return response.data?.chat || 'Error: No reply';
}