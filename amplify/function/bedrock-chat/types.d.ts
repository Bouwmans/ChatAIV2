declare module '@aws-sdk/client-bedrock-runtime' {
  interface InvokeModelCommandInput {
    modelId: string;
    body: string;
    contentType: string;
  }

  interface InvokeModelCommandOutput {
    body?: Uint8Array | string;
  }

  export class InvokeModelCommand {
    constructor(input: InvokeModelCommandInput);
  }

  export class BedrockRuntimeClient {
    constructor(config: { region: string });
    send(command: InvokeModelCommand): Promise<InvokeModelCommandOutput>;
  }
}
