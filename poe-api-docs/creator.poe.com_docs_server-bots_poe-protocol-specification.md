---
url: "https://creator.poe.com/docs/server-bots/poe-protocol-specification"
title: "Poe Protocol Specification | Poe Creator Platform"
---

# Poe Protocol Specification

Copy for LLMView as Markdown

[Poe](https://poe.com/) is a platform for interacting with AI-based bots. Poe provides access to popular chat bots like OpenAI's GPT-5.4 and Anthropic's Claude, but also allows a creator to create their own bot by implementing the following protocol.

## [Introduction](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#introduction)

This specification provides a way to run custom bots from any web-accessible service that can be used by the Poe app. Poe users will send requests to the Poe server, which will in turn send requests to the bot server using this specification. As the bot server responds, Poe will show the response to the user. See [Quick start](https://creator.poe.com/docs/server-bots/quick-start) for a high-level introduction to running a server bot.

### [Terminology](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#terminology)

- _**Poe server**:_ server run by Poe that receives client requests, turns them into requests to bot servers, and streams the response back to the Poe client.
- _**Bot server**:_ server run by the creator that responds to requests from Poe servers. The responses are ultimately shown to users in their Poe client.

* * *

## [Concepts](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#concepts)

### [Identifiers](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#identifiers)

The protocol uses identifiers for certain request fields. These are labeled as “identifier” in the specification. Identifiers are globally unique. They consist of a sequence of 1 to 3 lowercase ASCII characters, followed by a hyphen, followed by 32 lowercase alphanumeric ASCII characters or `=` characters (i.e., they fulfill the regex `^[a-z]{1,3}-[a-z0-9=]{32}$`).

The characters before the hyphen are a tag that represents the type of the object. The following types are currently in use:

- `m`: represents a message
- `u`: represents a user
- `c`: represents a conversation (thread)
- `d`: represents metadata sent with a message

### [Authentication](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#authentication)

While creating a bot, a creator can provide an access key consisting of 32 ASCII characters. To allow bot servers to confirm that the requests come from Poe, all requests will have an Authorization HTTP header `Bearer <access_key>`.

### [Content types](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#content-types)

Messages may use the following content types:

- `text/plain`: Plain text, rendered without further processing
- `text/markdown`: Markdown text. Specifically, this supports all features of GitHub-Flavored Markdown (GFM, specified at [https://github.github.com/gfm/](https://github.github.com/gfm/)). Poe may however modify the rendered Markdown for security or usability reasons.

### [Versioning](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#versioning)

It is expected that the API will be extended in the future to support additional features. The protocol version string consists of two numbers (e.g., 1.0).

The first number is the _request version_. It will be incremented if the form the request takes changes in an incompatible fashion. For example, the current protocol only contains a single API call from Poe servers to bot servers. If we were to add another API call that bot servers are expected to support, we would increment the request version (e.g., from 1.0 to 2.0). This is expected to be very rare, and it will be communicated to bot servers well in advance.

The second number is the _response version._ It will be incremented whenever the Poe server adds support for a new feature that bot servers can use. For example, as of this version we support two content types in LLM responses. If we were to add a third, we would increment the response version (e.g., from 1.0 to 1.1). Bot servers written for an earlier response version will continue to work; they simply will not use the new feature.

The response version is also incremented for backward-compatible changes to the request. For example, if we add a new field to the request body, we would increment the response version. This is safe for old bot servers as they will simply ignore the added field.

Throughout the protocol, bot servers should ignore any dictionary keys without a specified meaning. They may be used in a future version of the protocol.

### [Limits](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#limits)

Poe may implement limits on bot servers to ensure the reliability and scalability of the product. In particular:

- The initial response to any request must be returned within 5 seconds.
- The response to any request (including `query` requests) must be completed within 3600 seconds.
- The total length of a bot response (the sum of the length of all `text` events sent in response to a `query` request) may not exceed 512,000 characters.
- The total number of events sent in response to a `query` event may not exceed 10,000.
- If the number of messages in a user's previous conversation with the bot exceeds 1000, Poe may truncate the conversation.

We may raise these limits in the future if good use cases come up.

* * *

## [Requests](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#requests)

The Poe server will send an HTTP POST request to the bot servers URL with content type `application/json`. The body will be a JSON dictionary with the following keys:

- `version` _(string)_: The API version that the server is using.
- `type` _(string)_: This is one of the following strings:
  - `query`: Called when the user makes a query to the bot (i.e., they send a message).
  - `settings`: Query the bot for its desired settings.
  - `report_feedback`: ( **Deprecated in favor of `report_reaction`**) Report to the bot server when user likes/dislikes a message.
  - `report_reaction`: Report to the bot server when certain reactions happen (e.g., the user hearts a message).
  - `report_error`: Report to the bot server when an error happens that is attributable to the bot (e.g., it uses the protocol incorrectly).
  - Additional request types may be added in the future. Bot servers should ignore any request types they do not understand, ideally by sending a `501 Not Implemented` HTTP response.

Each of the request types is discussed in detail below:

### [query](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#query)

#### [The `query` request type](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#the-query-request-type)

In addition to the request fields that are valid for all queries, `query` requests take the following parameters in the request:

- `query`: An array containing one or more dictionaries that represent a previous message in the conversation with the bot. These are in chronological order, the most recent message last. It includes all messages in the current context window (see above). These dictionaries contain the following keys:
  - `role`(string): one of the following strings:
    - `system`: A message that tells the bot how it should work. Example: “You are an AI assistant that gives useful information to Poe users.”
    - `user`: A message from the user. Example: “What is the capital of Nepal?"
    - `bot`: A response from the bot. Example: “The capital of Nepal is Kathmandu.”
    - More roles may be added in the future. Bot servers should ignore messages with roles they do not recognize.
  - `content` (string): The text of the message.
  - `content_type` (string): The content type of the message (see under “Content type” above). Bots should ignore messages with content types they do not understand.
  - `timestamp` (int): The time the message was sent, as the number of microseconds since the Unix epoch.
  - `message_id` (identifier with type m): Identifier for this message.
  - `feedback`(array): A list of dictionaries representing feedback that the user gave to the message. Each dictionary has the following keys:
    - `type` (string): Either `like` or `dislike`. More types may be added in the future and bot servers should ignore types they do not recognize.
    - `reason` (string): A string representing the reason for the action. This key may be omitted.
  - `attachments`(array): A list of dictionaries representing attachments that the user has sent with message. Each dictionary has the following keys:
    - `url` (string): A URL pointing to the raw file. This URL is only guaranteed to remain valid for 10 minutes from when the request is sent.
    - `content_type` (string): The MIME type for the file (e.g., `image/png` or `application/pdf`).
    - `name` (string): The file name for the file (e.g., `paper.pdf`).
    - `parsed_content` (Optional string): If `expand_text_attachments` or `enable_image_comprehension` are enabled, parsed content will be passed in through this field.
  - `parameters` (dictionary): Optional key-value pairs containing user-configured parameter values from UI controls. For more information about parameters and controls, see [Getting parameter values from a user message](https://creator.poe.com/docs/server-bots/parameter-controls#getting-parameter-values-from-user-messages).
  - `metadata` (Optional string): A string containing arbitrary data set by a server bot. If no metadata was set, this will be `null`.
- `message_id` (identifier with type `m`): identifier for the message that the bot will create; also used for the `report_reaction` endpoint, as well as the `post_message_attachment` function.
- `user_id` (identifier with type `u`): the user making the request
- `conversation_id` (identifier with type `c`): identifier for the conversation (thread) the user is currently in. Resets when context is cleared.
- `metadata` (identifier with type `d`): internal metadata used by Poe when [accessing other bots](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe). This data must be sent when using the API to access other Poe bots.
- `users`(array): A list of dictionaries representing users who are part of the chat. This is meant to be used to receive list of users from Poe. Each dictionary has the following keys:
  - `id` (identifier with type `u`): An identifier representing the user
  - `name` (Optional string): The name of the user if user name is available for this chat. Typically, user name is only available in a chat of multiple users. Please note that a user can change their name anytime and different users with different `id` can share the same name.

The Poe server may also send the following parameters influencing how the underlying LLM, if any, is invoked. Bot servers may ignore these parameters or treat them as hints as they wish:

- `temperature` (float in range `0 <= temperature <= infinity`): indicates what temperature the bot should use while making requests. Bots for which this setting does not make sense may ignore this parameter.
- `skip_system_prompt` (boolean): if set to true, bots should minimize any adjustments they make to the prompt before sending data to the underlying LLM. Exactly what this means is up to individual bots.
- `stop_sequences` (array of string): if the LLM encounters one of these strings, it should stop its response.
- `logit_bias` (object with float values): an object where the keys are tokens and the values are floats in the range `-100 <= value <= 100`, where a negative value makes the token less likely to be emitted and a positive value makes the token more likely to be emitted.

#### [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#response)

The bot server should respond with an HTTP response code of 200. If any other response code is returned, the Poe server will show an error message to the user. The server must respond with a stream of server-sent events, as specified by the WhatWG ( [https://html.spec.whatwg.org/multipage/server-sent-events.html](https://html.spec.whatwg.org/multipage/server-sent-events.html)).

Server-sent events contain a type and data. The Poe API supports several event types with different meanings. For each type, the data is a JSON string as specified below. The following event types are supported:

- `meta`: represents metadata about how the Poe server should treat the bot server response. This event should be the first event sent back by the bot server. If no `meta` event is given, the default values are used. If a `meta` event is not the first event, the behavior is unspecified; currently it is ignored but future extensions to the protocol may allow multiple `meta` events in one response. The data dictionary supports the following keys (any additional keys passed are currently ignored, but may gain a meaning in a future version of the protocol):
  - `content_type` (string, defaults to `text/markdown`): If this is `text/markdown`, the response is rendered as Markdown by the Poe client. If it is `text/plain`, the response is rendered as plain text. Other values are unsupported and are treated like `text/plain`.
  - `suggested_replies` (boolean, defaults to false): If this is true, Poe will suggest followup messages to the user that they might want to send to the bot. If this is false, no suggested replies will be shown to the user. Note that the protocol also supports bots sending their own suggested replies (see below). If the bot server sends any `suggested_reply` event, Poe will not show any of its own suggested replies, only those suggested by the bot, regardless of the value of the `suggested_replies` setting.
- `text`: represents a piece of text to send to the user. This is a partial response; the text shown to the user when the request is complete will be a concatenation of the texts from all `text` events. The data dictionary may have the following keys:
  - `text` (string): A partial response to the user’s query
- `file`: represents a file attachment generated by a bot. Yield this to attach a file to your bot's response. If you use `fastapi_poe`, this event is implicitly yielded when you call `post_message_attachment`.
  - `url` (string): The url of the attachment file
  - `name`(string): The name of the attachment file
  - `content_type`(string): The MIME type of the attachment file
  - `inline_ref`(Optional\[string\]): If you wish for this file to be displayed inline markdown, pass a reference string here.
- `data`: Represents a piece of arbitrary data to be attached with the bot response. Data sent via this event can be retrieved later by accessing the `metadata` property of the associated `query` dictionary. Note that only the final `data` event in the stream will be attached to the bot response. The data dictionary must have the following keys:
  - `metadata` (string): String of data to attach to the bot response.
- `replace_response`: like `text`, but discards all previous `text` events. The user will no longer see the previous responses, and instead see only the text provided by this event. The data dictionary must have the following keys:
  - `text` (string): A partial response to the user's query
- `suggested_reply`: represents a suggested followup query that the user can send to reply to the bot’s query. The Poe UI may show these followups as buttons the user can press to immediately send a new query. The data dictionary has the following keys:
  - `text` (string): Text of the suggested reply.
- `error`: indicates that an error occurred in the bot server. If this event type is received, the server will close the connection and indicate to the user that there was an error communicating with the bot server. The server may retry the request. The data dictionary may contain the following keys:
  - `allow_retry` (boolean): If this is False, the server will not retry the request. If this is True or omitted, the server may retry the request.
  - `text` (string): The message the user will see regarding the error. Consider translating the message using the QueryRequest's `language_code` for better readability.
  - `raw_response` (Exception): Optionally, pass in the raw exception into this field for easier debugging. The user will not see this field.
  - `error_type` (string): May contain an `error_type`. Specifying an `error_type` allows Poe to handle protocol bot errors similarly to Poe-internal errors. See [#supported-error\_types](https://creator.poe.com/docs/server-bots/poe-protocol-specification#supported-error_types) for more information.
- `done`: must be the last event in the stream, indicating that the bot response is finished. The server will close the connection after this event is received. The data for this event is currently ignored, but it must be valid JSON.

The bot response must include at least one `text` or `error` event; it is an error to send no response.

If the Poe server receives an event type it does not recognize, it ignores the event.

#### [Supported error\_types](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#supported-error_types)

- `insufficient_fund`
  - Raise this if the latest user message fails due to not having enough compute points. This will raise an error to the user.
- `user_message_too_long`
  - Raise this if the latest user message is too long for the API bot to handle. This will raise an error to the user.
- `user_caused_error`
  - Raise this if the latest user message is caused by some other general error aside from the other error types, such as invalid input, input file type not supported, content moderated, etc. This will raise an error to the user.

### [settings](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#settings)

This request takes no additional request parameters other than the standard ones.

The server should respond with a response code of 200 and content type of `application/json`. The JSON response should be a dictionary containing the keys listed below. All keys are optional; if they are not specified the default values are used. Poe reserves the right to change the defaults at any time, so if bots rely on a particular setting, they should set it explicitly.

If a settings request fails (it does not return a 200 response code with a valid JSON body), the previous settings are used for the bot. If this is the first request, that means the default values are used for all settings; if it is a refetch request, the settings previously used for the bot remain in use. If the request does not return a 2xx or 501 response code, the Poe server may retry the settings request after some time.

#### [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#response-1)

The response may contain the following keys:

- `response_version` (integer): Different Poe Protocol versions use different default settings
values. When provided, Poe will use the default values for the specified response version.
If not provided, Poe will use the default values for response version 0.
- `server_bot_dependencies` (mapping of strings to integers): Declare what bots your server bot will access through the [bot query API](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe). The keys in the mapping are handles of Poe bots and the values are the number of calls to each bot that the server bot is expected to make. For example, setting this field to `{"GPT-5.4": 1}` declares that the bot will use a single call to GPT-5.4. Poe may show this value to users, and will enforce that bots do not access other bots that they did not declare beforehand.
- `parameter_controls` (dictionary): Optional JSON object that defines interactive parameter controls. The object must contain an api\_version and sections array. For more information about parameters and controls, see [Adding parameter controls](https://creator.poe.com/docs/server-bots/parameter-controls#adding-parameter-controls-to-your-bot)
- `allow_attachments` (boolean): If true, allow users to send attachments with messages sent to the bot. Defaults to True.
- `expand_text_attachments` (boolean): If `allow_attachments=True`, Poe will parse text files and send their content in the parsed\_content field of the attachment object. Defaults to True.
- `enable_image_comprehension` (boolean): If `allow_attachments=True`, Poe will use image vision to generate a description of image attachments and send their content in the `parsed_content` field of the attachment object. If this is enabled, the Poe user will only be able to send at most one image per message due to image vision limitations. Defaults to False.
- `introduction_message` (string): Set a message that the bot will use to introduce itself to users at the start of a chat. This message is always treated as Markdown. By default, bots will have no introduction.
- `enforce_author_role_alternation` (boolean): whether Poe should concatenate messages to follow strict user/bot alternation before sending to the bot. Defaults to False.
- `enable_multi_entity_prompting` (boolean): whether Poe should process previous chat history with special prompting so that the current bot will have sufficient context about a multi entity chat. Defaults to True.

### [report\_feedback (Deprecated)](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#report_feedback-deprecated)

**Note: Deprecated, please use report\_reaction instead.**

This request takes the following additional parameters:

- `message_id` (identifier with type m): The message for which feedback is provided.
- `user_id` (identifier with type `u`): The user providing the feedback
- `conversation_id` (identifier with type `c`): The conversation giving rise to the feedback
- `feedback_type` (string): May be `like` or `dislike`. Additional types may be added in the future; bot servers should ignore feedback with types they do not recognize.

#### [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#response-2)

The server’s response is ignored.

### [report\_reaction](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#report_reaction)

This request takes the following additional parameters:

- `message_id` (identifier with type `m`): The message for which a reaction is being provided.
- `user_id` (identifier with type `u`): The user providing the reaction.
- `conversation_id` (identifier with type `c`): The conversation giving rise to the reaction.
- `reaction` (string): May be `like`, `dislike`, `heart`, `laughing`, `surprised`, `sad`. Additional values may be added in the future; bot servers should ignore reactions with values they do not recognize.

#### [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#response-3)

The server’s response is ignored.

### [report\_error](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#report_error)

When the bot server fails to use the protocol correctly (e.g., when it uses the wrong types in response to a `settings` request, the Poe server may make a `report_error` request to the server that reports what went wrong. The protocol does not guarantee that the endpoint will be called for every error; it is merely intended as a convenience to help bot server creators debug their bot.

This request takes the following additional parameters:

- `message` (string): A string describing the error.
- `metadata` (dictionary): May contain metadata that may be helpful in diagnosing the error, such as the `conversation_id` for the conversation. The exact contents of the dictionary are not specified and may change at any time.

#### [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#response-4)

The server’s response is ignored.

* * *

## [Samples](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#samples)

![Image](https://files.readme.io/5f4f294-image.png)

Suppose we’re having the above conversation over Poe with a bot server running at `https://ai.example.com/llm`.

For the Poe conversation above, the Poe server sends a POST request to `https://ai.example.com/llm` with the following JSON in the body:

```
{
    "version": "1.0",
    "type": "query",
    "query": [\
        {\
            "role": "user",\
            "content": "What is the capital of Nepal?",\
            "content_type": "text/markdown",\
            "timestamp": 1678299819427621,\
        }\
    ],
    "user": "u-1234abcd5678efgh",
    "conversation": "c-jklm9012nopq3456",
}
```

The bot server responds with an HTTP 200 response code, then sends the following server-sent events:

```
event: meta
data: {"content_type": "text/markdown", "linkify": true}

event: text
data: {"text": "The"}

event: text
data: {"text": " capital of Nepal is"}

event: text
data: {"text": " Kathmandu."}

event: done
data: {}
```

The text may also be split into more or fewer individual events as desired. Sending more events means that users will see partial responses from the bot server faster.

* * *

## [Next steps](https://creator.poe.com/docs/server-bots/poe-protocol-specification\#next-steps)

- Check out our [quick start](https://creator.poe.com/docs/server-bots/quick-start) to promptly get a bot running.
- [fastapi-poe](https://github.com/poe-platform/fastapi_poe), a library for building Poe bots using the FastAPI framework. We recommend using this library if you are building your own bot.
- [Example Bots](https://creator.poe.com/docs/server-bots/examples)

On this page

[Introduction](https://creator.poe.com/docs/server-bots/poe-protocol-specification#introduction) [Terminology](https://creator.poe.com/docs/server-bots/poe-protocol-specification#terminology) [Concepts](https://creator.poe.com/docs/server-bots/poe-protocol-specification#concepts) [Identifiers](https://creator.poe.com/docs/server-bots/poe-protocol-specification#identifiers) [Authentication](https://creator.poe.com/docs/server-bots/poe-protocol-specification#authentication) [Content types](https://creator.poe.com/docs/server-bots/poe-protocol-specification#content-types) [Versioning](https://creator.poe.com/docs/server-bots/poe-protocol-specification#versioning) [Limits](https://creator.poe.com/docs/server-bots/poe-protocol-specification#limits) [Requests](https://creator.poe.com/docs/server-bots/poe-protocol-specification#requests) [query](https://creator.poe.com/docs/server-bots/poe-protocol-specification#query) [The `query` request type](https://creator.poe.com/docs/server-bots/poe-protocol-specification#the-query-request-type) [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification#response) [Supported error\_types](https://creator.poe.com/docs/server-bots/poe-protocol-specification#supported-error_types) [settings](https://creator.poe.com/docs/server-bots/poe-protocol-specification#settings) [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification#response-1) [report\_feedback (Deprecated)](https://creator.poe.com/docs/server-bots/poe-protocol-specification#report_feedback-deprecated) [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification#response-2) [report\_reaction](https://creator.poe.com/docs/server-bots/poe-protocol-specification#report_reaction) [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification#response-3) [report\_error](https://creator.poe.com/docs/server-bots/poe-protocol-specification#report_error) [Response](https://creator.poe.com/docs/server-bots/poe-protocol-specification#response-4) [Samples](https://creator.poe.com/docs/server-bots/poe-protocol-specification#samples) [Next steps](https://creator.poe.com/docs/server-bots/poe-protocol-specification#next-steps)