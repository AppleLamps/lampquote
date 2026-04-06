---
url: "https://creator.poe.com/docs/server-bots/updating-bot-settings"
title: "Updating bot settings | Poe Creator Platform"
---

# Updating bot settings

Copy for LLMView as Markdown

The settings endpoint provides a way for you to opt in/out of Poe's features enabling you to customize the behavior of the bot. This article will describe how you can get Poe to fetch the latest settings from your bot.

#### [**Sync Bot settings automatically**](https://creator.poe.com/docs/server-bots/updating-bot-settings\#sync-bot-settings-automatically)

The best way to to keep your server bot configs synced is to set `bot_name` and `access_key` for your `PoeBot` subclass. When this is configured properly, the bot settings will sync automatically whenever bot server starts or updates.

The following is an example:

```
@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = ExampleBot(
      access_key={bot_access_key},
      bot_name={your_bot_name},
    )
    app = fp.make_app(
      bot,
      allow_without_key: bool = True,
    )
    return app
```

If `bot_name` and `access_key` are not set, please reference [this section below to sync bot settings manually](https://creator.poe.com/docs/server-bots/updating-bot-settings#sync-bot-settings-manually).

#### [**Sync Bot settings manually**](https://creator.poe.com/docs/server-bots/updating-bot-settings\#sync-bot-settings-manually)

#### [1\. Set up your endpoint as described by the specs](https://creator.poe.com/docs/server-bots/updating-bot-settings\#1-set-up-your-endpoint-as-described-by-the-specs)

If you are using the `fastapi_poe` library, then you just need to implement the `get_settings` method in the `PoeBot` class. The following is an example:

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(allow_attachments=True)
```

#### [2\. Get your access key](https://creator.poe.com/docs/server-bots/updating-bot-settings\#2-get-your-access-key)

You can find this key in the edit bot page of your bot.

![Image](https://files.readme.io/45f8a6d-image.png)

#### [3\. Make a post request to Poe's refetch settings endpoint with your bot name and access key.](https://creator.poe.com/docs/server-bots/updating-bot-settings\#3-make-a-post-request-to-poes-refetch-settings-endpoint-with-your-bot-name-and-access-key)

On Windows, you can use the `Invoke-RestMethod` command. On a Macbook or Linux machine, you can use the curl command as follows:

`curl -X POST https://api.poe.com/bot/fetch_settings/<botname>/<access_key>`

If you don't want to look for the `PROTOCOL_VERSION`, you could write a python script that calls `fp.sync_bot_settings`, and run the script.

```
import fastapi_poe as fp

# Replace the bot name and access key with information of your bot
bot_name = "server_bot_name"
access_key = "your_server_bot_access_key"

fp.sync_bot_settings(bot_name, access_key)
```

That's it. The response to the above request will inform you whether the updated successfully.

On this page

[**Sync Bot settings automatically**](https://creator.poe.com/docs/server-bots/updating-bot-settings#sync-bot-settings-automatically) [**Sync Bot settings manually**](https://creator.poe.com/docs/server-bots/updating-bot-settings#sync-bot-settings-manually) [1\. Set up your endpoint as described by the specs](https://creator.poe.com/docs/server-bots/updating-bot-settings#1-set-up-your-endpoint-as-described-by-the-specs) [2\. Get your access key](https://creator.poe.com/docs/server-bots/updating-bot-settings#2-get-your-access-key) [3\. Make a post request to Poe's refetch settings endpoint with your bot name and access key.](https://creator.poe.com/docs/server-bots/updating-bot-settings#3-make-a-post-request-to-poes-refetch-settings-endpoint-with-your-bot-name-and-access-key)