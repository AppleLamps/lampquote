---
url: "https://creator.poe.com/docs/server-bots/setting-an-introduction-message"
title: "Setting an introduction message | Poe Creator Platform"
---

# Setting an introduction message

Copy for LLMView as Markdown

The Poe API allows you to set a friendly introduction message for your bot, providing you with a way to instruct the users on how they should use the bot. In order to do so, you have to override `get_settings` and set the parameter called `introduction_message` to whatever you want that message to be.

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(
        introduction_message="Welcome to the trivia bot. Please provide me a topic that you would like me to quiz you on."
    )
```

The final code (including the setup code you need to host this on [Modal](https://modal.com/)) that goes into our `main.py` is as follows:

```
from __future__ import annotations
from typing import AsyncIterable
from modal import Image, Stub, asgi_app
import fastapi_poe as fp

class TriviaBotSample(fp.PoeBot):
    async def get_response(self, query: fp.QueryRequest) -> AsyncIterable[fp.PartialResponse]:
        # implement the trivia bot.
        yield fp.PartialResponse(text="Bot under construction. Please visit later")

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(
            introduction_message="Welcome to the trivia bot. Please provide me a topic that you would like me to quiz you on."
        )

REQUIREMENTS = ["fastapi-poe==0.0.36"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
stub = Stub("trivia-poe")

@stub.function(image=image)
@asgi_app()
def fastapi_app():
    bot = TriviaBotSample()
    app = fp.make_app(bot, allow_without_key=True)
    return app
```

To learn how to setup Modal, please follow Steps 1 and 2 in our [Quick start](https://creator.poe.com/docs/server-bots/quick-start). If you already have Modal set up, simply run `modal deploy main.py`. Modal will then deploy your bot server to the cloud and output the server url. Use that url when creating a server bot on [Poe](https://poe.com/create_bot?server=1). Once your bot is up, update your bot's settings (one time only after you override `get_settings`) by following [this](https://creator.poe.com/docs/server-bots/updating-bot-settings) guide. That's it, your bot is now ready.

![Image](https://files.readme.io/f75dde0-image.png)