// amplify/functions/chatbedrock/resource.ts
import { defineFunction } from '@aws-amplify/backend';

/**
 * Defines Lambda for Bedrock Claude chat.
 * - Env: Only model ID (region auto-set by Lambda runtime).
 */
export const BEDROCK_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';  // Cheap/fast for prototype.

export const chatBedrock = defineFunction({
  name: 'chatBedrock',
  entry: './handler.ts',
  environment: {
    BEDROCK_MODEL_ID,  // Fixed: Removed AWS_REGION (reserved by Lambda).
  },
});