---
url: "https://creator.poe.com/docs/canvas-apps/poe-embed-api"
title: "Poe Embed API | Poe Creator Platform"
---

# Poe Embed API

Copy for LLMView as Markdown

## [Getting started](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#getting-started)

The Poe Embed API is automatically included in HTML applications running inside Poe. Visit [poe.com/App-Creator](http://poe.com/App-Creator) to build a canvas app that uses the api.

## [Methods](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#methods)

Methods are accessible through the `window.Poe` global object.

| Method | Description |
| --- | --- |
| `sendUserMessage` | Sends a message in the chat on behalf of the current user. |
| `registerHandler` | Registers a function to receive the results of `sendUserMessage` |
| `getTriggerMessage` | Returns information about the human message that triggered the canvas tab to open. |
| `captureCost` | Captures and charges the user for creator-defined paid events |

### [`window.Poe.sendUserMessage`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#windowpoesendusermessage)

Sends a message in the chat on behalf of the current user. In some cases it may throw a `PoeEmbedAPIError`. To see the results of the message, use the `registerHandler` method.

The current user will be charged for the cost of the sent messages and in some cases will be asked to authorize the costs. Try it with [poe.com/EmbedAPIDebugger](http://poe.com/EmbedAPIDebugger).

```

 sendUserMessage<Stream extends boolean>(
    /** The text to send.  In most cases this should start with `@BotName` */
    text: string,
    options?: {
      /** Files to include */
      attachments?: File[];
      /** Whether to invoke the handler with incomplete results as they are available or to only invoke it with the final complete result.  Each result contains all tokens so far. */
      stream?: Stream;
      /** Whether to open the chat on send. */
      openChat?: boolean;
      /** The registered name of the handler function to invoke with the results */
      handler?: string;
      /** Optional additional context to pass to the handler. */
      handlerContext?: HandlerContext;
    }
  ): Promise<
    { success: boolean}
  >;
```

### [`window.Poe.registerHandler`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#windowpoeregisterhandler)

Registers a callback function to the results of `sendUserMessage`. The callback receives results if the `name` of the handler, matches the `handler` argument passed into `sendUserMessage`.

```
  registerHandler(
    /**
     * String identifier for the handler. Used to associate responses with this callback.
     */
    name: string,
    /**
     * Callback function that receives response messages. Each result contains an array
     * of messages with their content and status.
     * The handlerContext specified in the sendUserMessage call will also be passed to the callback.
     */
    func: (result: SendUserMessageResult, context: HandlerContext) => void
  ): VoidFunction;
```

Example:

```
let someFile: File

window.Poe.registerHandler("myHandler", (result) => {
  console.log(result.responses[0]?.content)
})

let result = await window.Poe.sendUserMessage(
    "@assistant what is this?",
    { attachments: [someFile], stream: true, handler: "myHandler" }
 )
 console.log(result) // { success: true }
```

### [`window.Poe.getTriggerMessage`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#windowpoegettriggermessage)

Returns a Promise that resolves with the `Message` that triggered the canvas app to open.

```
  getTriggerMessage(): Promise<Message>
```

- _Message_: [https://creator.poe.com/docs/poe-embed-api#message](https://creator.poe.com/docs/poe-embed-api#message)

Example:

```
window.Poe.getTriggerMessage().then(msg => {
  msg.attachments.map((attachment, i) => {
    console.log(`Attachment ${i}: ${attachment.url}`)
  })
})
```

### [`window.Poe.captureCost`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#windowpoecapturecost)

Captures and charges the user for creator-defined paid events in your canvas app. This allows you to implement custom pricing for specific actions or features within your application. The user will be charged the specified amounts in USD milli-cents (1/100,000th of a dollar).

```
captureCost(
  /**
   * Array of cost amounts to capture. Each entry specifies an amount and optional description.
   */
  amounts: Array<{
    /** Amount in USD milli-cents (1/100,000th of a dollar). For example, 100000 = $1.00 */
    amountUsdMilliCents: number;
    /** Optional description of what this charge is for */
    description?: string
  }>,
  /**
   * Optional configuration for capturing cost.
   */
  options?: {
    /**
     * Whether to log the charge outcome to the console.
     * If true and successful, logs: "Creator-defined paid event: {description} | {captured_points} points"
     */
    logChargeOutcome?: boolean;
  }
): Promise<{ success: boolean }>;
```

Example:

```
// Charge the user $0.50 for a premium feature
try {
  const result = await window.Poe.captureCost(
    [{ amountUsdMilliCents: 50000, description: "Premium image generation" }],
    { logChargeOutcome: true } // Log the outcome
  );

  if (result.success) {
    // Proceed with the premium feature
  } else {
    // Do not proceed with the premium feature
  }
} catch (error) {
  console.error("Error capturing cost:", error);
}

// Charge for multiple items at once
await window.Poe.captureCost(
  [\
    { amountUsdMilliCents: 25000, description: "API call" },\
    { amountUsdMilliCents: 15000, description: "Storage fee" }\
  ],
  { logChargeOutcome: true }
);
```

**Prerequisites:**

- Be enrolled in Poe revenue sharing

**Important notes:**

- Amounts are specified in USD milli-cents: `100000 = $1.00`, `50000 = $0.50`, `1000 = $0.01`
- The function returns a promise that resolves with `{ success: boolean }`
- If there's an error, the promise will be rejected with an error message
- Error messages (if any) are automatically logged to the console
- When `logChargeOutcome` is `true` and the charge is successful, a log message is printed showing the description and points captured
- (Optional) Define a rate card by including an HTML comment in your canvas app header. For example:







```
<!-- APP_SETTINGS_START {"rateCard": "Cost overview:

| Type | Rate |
|------|------|
| Event 1 | [usd_milli_cents=10] points |"} APP_SETTINGS_END -->
```


## [Objects](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#objects)

### [**`SendUserMessageResult`**](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#sendusermessageresult)

This object is passed into handlers of _sendUserMessage_ calls.

```

type SendUserMessageResult = {
  status: "incomplete" | "complete" | "error";
  /**
   * In most cases, this will be a single bot message however in some cases a single human message
   * may trigger multiple bot responses.
   */
  responses: Message[];
};
```

### [`Message`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#message)

A message from a bot that may appear in `SendUserMessageResult["responses"]`. _content_ always contains the text of the message so far.

```
/** A message from the bot. */
type Message = {
  messageId: string;
  /** The name of the bot that sent the message. e.g. "Assistant" */
  senderId: string;
  /** The entire content of the message recieved so far */
  content: string;
  /** Either text/plain or text/markdown */
  contentType: string;
  /** Each status should be handled to let the user know the current state of the message. */
  status: "incomplete" | "complete" | "error";
  /** A user friendly message to explain the current status.  Usually only specified for error status. */
  statusText?: string;
  attachments?: MessageAttachment[];
};
```

## [Errors](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#errors)

### [`PoeEmbedAPIError`](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#poeembedapierror)

The error that may be thrown by `sendUserMessage`.

```
interface PoeEmbedAPIError extends Error {
  errorType: PoeEmbedAPIErrorType;
}

type PoeEmbedAPIErrorType = "UNKNOWN" | "INVALID_INPUT" | "USER_REJECTED_CONFIRMATION" | "ANOTHER_CONFIRMATION_IS_OPEN"
```

PoeApiErrorType is a union of strings:

- `UNKNOWN` \- Something unexpected happened. This may occur when using an old version of the sdk
- `INVALID_INPUT` \- When the input was invalid. Check `error.message` for more info
- `USER_REJECTED_CONFIRMATION` \- When the action requires user confirmation, and the user rejected it
- `ANOTHER_CONFIRMATION_IS_OPEN` \- When the action (e.g. _sendUserMessage_) requires user confirmation, but another confirmation is already open.
  - This error is only relevant to “inline” codeblock previews that are rendered inside a message.

## [Typescript Definitions](https://creator.poe.com/docs/canvas-apps/poe-embed-api\#typescript-definitions)

```

/** The public interface of the Embed API.  This class is accessible from `window.Poe` */
interface PoeEmbedAPI {
  /** Send a message to the bot. */
  sendUserMessage<Stream extends boolean>(
    /** The text to send.  In most cases this should start with `@BotName` */
    text: string,
    options?: {
      /** Files to include in the user message. */
      attachments?: File[];
      /** Whether to invoke the handler with incomplete results as they are available or to only invoke it with the final complete result.  Each result contains all tokens so far. */
      stream?: Stream;
      /** Whether to open the chat on send. */
      openChat?: boolean;
      /** The name of the handler function to invoke with the results */
      handler?: string;
      /** Optional additional context to pass to the handler. */
      handlerContext?: HandlerContext;
    }
  ): Promise<
    { success: boolean}
  >;

  /** Register a handler function that is invoked with the results of the `sendUserMessage` call. The handler should be registered before the `sendUserMessage` call is made and ideally before the user has made interactions with the page. */
  registerHandler(
    /** The name of the handler function to register. This name should match the `handler` option in `sendUserMessage`. */
    name: string,
    /** The function that is invoked with the results of the `sendUserMessage` call. */
    func: (result: SendUserMessageResult, context: HandlerContext) => void
  ): VoidFunction;

  /** Captures and charges the user for creator-defined paid events. */
  captureCost(
    /** Array of cost amounts to capture. Amounts are in USD milli-cents (1/100,000th of a dollar). */
    amounts: Array<{
      amountUsdMilliCents: number;
      description?: string;
    }>,
    /** Optional configuration for capturing cost. */
    options?: {
      /** Whether to log the charge outcome to the console. */
      logChargeOutcome?: boolean;
    }
  ): Promise<{ success: boolean }>;

  APIError: typeof PoeEmbedAPIError;
}

/** Error that may be thrown by an Embed API method such as `sendUserMessage` */
class PoeEmbedAPIError extends Error {
  errorType: PoeEmbedAPIErrorType;
}

type MessageAttachment = {
  attachmentId: string;
  mimeType: string;
  url: string;
  isInline: boolean;
  name: string;
};

/** A message from the bot. */
type Message = {
  messageId: string;
  /** The name of the bot that sent the message. e.g. "Assistant" */
  senderId: string;
  /** The entire content of the message recieved so far */
  content: string;
  /** Either text/plain or text/markdown */
  contentType: string;
  /** Each status should be handled to let the user know the current state of the message. */
  status: "incomplete" | "complete" | "error";
  /** A user friendly message to explain the current status.  Usually only specified for error status. */
  statusText?: string;
  attachments?: MessageAttachment[];
};

type SendUserMessageResult = {
  status: "incomplete" | "complete" | "error";
  /**
   * In most cases, this will be a single bot message however in some cases a single human message
   * may trigger multiple bot responses.
   */
  responses: Message[];
};

type HandlerContext = Record<string, any>;
type HandlerFunc = (
  result: SendUserMessageResult,
  context: HandlerContext
) => void;

type PoeEmbedAPIErrorType =
  | "UNKNOWN"
  | "INVALID_INPUT"
  | "USER_REJECTED_CONFIRMATION"
  | "ANOTHER_CONFIRMATION_IS_OPEN";

/** accessible via window.Poe */
declare global {
  interface Window {
    Poe: PoeEmbedAPI;
  }
}
```

On this page

[Getting started](https://creator.poe.com/docs/canvas-apps/poe-embed-api#getting-started) [Methods](https://creator.poe.com/docs/canvas-apps/poe-embed-api#methods) [`window.Poe.sendUserMessage`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#windowpoesendusermessage) [`window.Poe.registerHandler`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#windowpoeregisterhandler) [`window.Poe.getTriggerMessage`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#windowpoegettriggermessage) [`window.Poe.captureCost`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#windowpoecapturecost) [Objects](https://creator.poe.com/docs/canvas-apps/poe-embed-api#objects) [**`SendUserMessageResult`**](https://creator.poe.com/docs/canvas-apps/poe-embed-api#sendusermessageresult) [`Message`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#message) [Errors](https://creator.poe.com/docs/canvas-apps/poe-embed-api#errors) [`PoeEmbedAPIError`](https://creator.poe.com/docs/canvas-apps/poe-embed-api#poeembedapierror) [Typescript Definitions](https://creator.poe.com/docs/canvas-apps/poe-embed-api#typescript-definitions)