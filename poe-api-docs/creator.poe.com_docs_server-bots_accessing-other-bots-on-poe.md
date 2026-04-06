---
url: "https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe"
title: "Accessing other bots on Poe | Poe Creator Platform"
---

# Accessing other bots on Poe

Copy for LLMView as Markdown

The Poe bot query API allows creators to invoke other bots on Poe (which includes bots created by Poe like GPT-5.4 and Claude-Sonnet-4.6).

If you are just getting started with server bots, we recommend checking out our [quick start](https://creator.poe.com/docs/server-bots/quick-start) guide. The following tutorial is specifically for how you invoke other bots and assumes that you are familiar with the concept of server bots.

> 🚧 Warning
>
> Poe’s custom bots (such as "Assistant") can change frequently. Their behavior and outputs may be updated without notice, so do not rely on their responses to remain consistent over time.

#### [Install the Poe FastAPI client](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#install-the-poe-fastapi-client)

```
pip install fastapi_poe
```

#### [Implement the PoeBot class](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#implement-the-poebot-class)

You have to declare your bot dependencies using the [settings](https://creator.poe.com/docs/server-bots/poe-protocol-specification#settings) endpoint.

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 1})
```

In your `get_response` handler, use the `stream_request` function to invoke any bot you want. The following is an example where we forward the user's query to `GPT-5.4` and return the result.

```
async def get_response(
    self, request: fp.QueryRequest
) -> AsyncIterable[fp.PartialResponse]:
    async for msg in fp.stream_request(
        request, "GPT-5.4", request.access_key
    ):
        yield msg
```

The final code (including the setup code you need to host this on [Modal](https://modal.com/)) that goes into your `main.py` is as follows:

```
from __future__ import annotations
from typing import AsyncIterable
from modal import Image, Stub, asgi_app
import fastapi_poe as fp

class GPT5Bot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request, "GPT-5.4", request.access_key
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 1})

REQUIREMENTS = ["fastapi-poe==0.0.36"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
stub = Stub("turbo-example-poe")

@stub.function(image=image)
@asgi_app()
def fastapi_app():
    bot = GPT5Bot()
    app = fp.make_app(bot, allow_without_key=True)
    return app
```

To learn how to setup Modal, please follow Steps 1 and 2 in our [Quick Start](https://creator.poe.com/docs/server-bots/quick-start). If you already have Modal set up, simply run `modal deploy main.py`. Modal will then deploy your bot server to the cloud and output the server url. Use that url when creating a server bot on [Poe](https://poe.com/create_bot?server=1).

Now, before you use the bot, you will have to follow the steps in [this](https://creator.poe.com/docs/server-bots/updating-bot-settings) article in order to get Poe to fetch your bot's settings (one time only after you override `get_settings`). Once that is done, try to use your bot on Poe and you will see the response from GPT-5.4. You can modify the code and do more interesting things (like apply some business logic on the response or conditionally call another API).

![Image](https://files.readme.io/b5a85af-image.png)

### [How to access the bot query API directly](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#how-to-access-the-bot-query-api-directly)

We also provide a helper function for you to test the bot query API in a lower friction manner.

#### [Install the Poe FastAPI client](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#install-the-poe-fastapi-client-1)

```
pip install fastapi_poe
```

#### [Get your API Key](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#get-your-api-key)

Navigate to [poe.com/api/keys](https://poe.com/api/keys) and copy your user API key.

![Image](https://files.readme.io/219ab72-image.png)

Usage done with this API key will be deducted from your Poe points balance.

#### [Access the bot query API using "get\_bot\_response"](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe\#access-the-bot-query-api-using-get_bot_response)

In your python shell, run the following after replacing the placeholder with your API key.

```
import asyncio
import fastapi_poe as fp

# Create an asynchronous function to encapsulate the async for loop
async def get_responses(api_key, messages):
    async for partial in fp.get_bot_response(messages=messages, bot_name="GPT-5.4", api_key=api_key):
        print(partial)

# Replace <api_key> with your actual API key, ensuring it is a string.
api_key = <api_key>
message = fp.ProtocolMessage(role="user", content="Hello world")

# Run the event loop
# For Python 3.7 and newer
asyncio.run(get_responses(api_key, [message]))

# For Python 3.6 and older, you would typically do the following:
# loop = asyncio.get_event_loop()
# loop.run_until_complete(get_responses(api_key))
# loop.close()
```

If you are using an ipython shell, you can instead use the following simpler code.

```
import fastapi_poe as fp

message = fp.ProtocolMessage(role="user", content="Hello world")
async for partial in fp.get_bot_response(messages=[message], bot_name="GPT-5.4", api_key=<api_key>):
    print(partial)
```

On this page

[Install the Poe FastAPI client](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#install-the-poe-fastapi-client) [Implement the PoeBot class](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#implement-the-poebot-class) [How to access the bot query API directly](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#how-to-access-the-bot-query-api-directly) [Install the Poe FastAPI client](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#install-the-poe-fastapi-client-1) [Get your API Key](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#get-your-api-key) [Access the bot query API using "get\_bot\_response"](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe#access-the-bot-query-api-using-get_bot_response)