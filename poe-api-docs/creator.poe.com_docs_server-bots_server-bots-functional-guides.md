---
url: "https://creator.poe.com/docs/server-bots/server-bots-functional-guides"
title: "Functional Guides | Poe Creator Platform"
---

# Functional Guides

Copy for LLMView as Markdown

If you are just getting started with server bots, we recommend checking out our [quick start](https://creator.poe.com/docs/server-bots/quick-start) guide. The following guides provide examples of accomplishing specific things with your bot.

- The examples assume that you have installed the latest version of fastapi\_poe (you can install this using pip by running `pip install fastapi_poe`.
- The full code examples also assume that you are hosting your bot on Modal. Although we recommend Modal for it's simplicity, you should be able to deploy your server bot on any cloud provider. To learn how to setup Modal, please follow Steps 1 and 2 in our [Quick start](https://creator.poe.com/docs/server-bots/quick-start). If you already have Modal set up, simply copy the full code examples into a file called `main.py` and then run `modal deploy main.py`. Modal will then deploy your bot server to the cloud and output the server url. Use that url when creating a server bot on [Poe](https://poe.com/create_bot?server=1).

## [Calling other bots on Poe](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#calling-other-bots-on-poe)

The `fp.stream_request` function allows server bots to call other bots on Poe (which includes bots created by Poe like GPT-5.4 and Claude-Sonnet-4.6 and bots created by other creators). These calls are charged to the user that chats with the server bot, so the creator does not have to worry about LLM costs. For every user message, server bots get to make up to 100 calls to other bots.

### [Declare dependencies in your PoeBot class](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#declare-dependencies-in-your-poebot-class)

Before making a call to another bot, you have to declare your bot dependencies using the [settings](https://creator.poe.com/docs/server-bots/poe-protocol-specification#settings) endpoint. For example, if your server bot will make a single call to GPT-5.4, your `server_bot_dependencies` in settings should look like this:

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 1})
```

### [Forwarding the User Conversation](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#forwarding-the-user-conversation)

The following is an example where we forward the user's exact query to `GPT-5.4` and return the result. This essentially creates a wrapper for GPT-5.4, and you can modify the output to whatever you'd like.

```
class GPT4oWrapperBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request, "GPT-5.4", request.access_key
        ):
            # Add whatever logic you'd like here before yielding the result!
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 1})
```

```
from __future__ import annotations
from typing import AsyncIterable
from modal import App, Image, asgi_app
import fastapi_poe as fp

class GPT4oWrapperBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request, "GPT-5.4", request.access_key
        ):
            # Add whatever logic you'd like here before yielding the result!
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 1})

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("GPT4oWrapperBot-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = GPT4oWrapperBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

Thats it! Try chatting with your bot now, and you should see responses from GPT-5.4.

### [Sending a Customized Message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#sending-a-customized-message)

If you would like to send a new message separate from the user's existing conversation, you can override the contents of the messages in the query to whatever you'd like. The following example takes the user message and overrides it to ask Claude-Sonnet-4.6 about whether the user is happy or sad.

```
class SentimentAnalysisBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        last_msg = request.query[-1]
        new_text = f"Do you think the user's message is happy or sad? {last_msg.content}"
        new_msg = last_msg.model_copy(update={"content": new_text})
        new_request = request.model_copy(update={"query": [new_msg]})
        async for msg in fp.stream_request(
            new_request, "Claude-Sonnet-4.6", request.access_key
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"Claude-Sonnet-4.6": 1})
```

```
from __future__ import annotations
from typing import AsyncIterable
from modal import App, Image, asgi_app
import fastapi_poe as fp

class SentimentAnalysisBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        last_msg = request.query[-1]
        new_text = f"Do you think the user's message is happy or sad? {last_msg.content}"
        new_msg = last_msg.model_copy(update={"content": new_text})
        new_request = request.model_copy(update={"query": [new_msg]})
        async for msg in fp.stream_request(
            new_request, "Claude-Sonnet-4.6", request.access_key
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"Claude-Sonnet-4.6": 1})

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("SentimentAnalysisBot-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = SentimentAnalysisBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

### [Sending Files as Part of the Query to Another Bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#sending-files-as-part-of-the-query-to-another-bot)

If you would like to add your own files to the query, you can do so using `fp.upload_file`. The following is another example of overriding the user message, but with a custom image file sent as well.

```
class LeopardEnjoymentBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        attachment = await fp.upload_file(
            file_url="https://images.pexels.com/photos/46254/leopard-wildcat-big-cat-botswana-46254.jpeg",
            file_name="leopard.jpeg",
            api_key=request.access_key,
        )
        last_msg = request.query[-1]
        new_text = f"Will the user like this image? User message: {last_msg.content}"
        new_msg = last_msg.model_copy(
            update={"content": new_text, "attachments": [attachment]}
        )
        new_request = request.model_copy(update={"query": [new_msg]})
        async for msg in fp.stream_request(
            new_request, "Claude-Sonnet-4.6", request.access_key
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"Claude-Sonnet-4.6": 1})
```

```
from __future__ import annotations
from typing import AsyncIterable
from modal import App, Image, asgi_app
import fastapi_poe as fp

class LeopardEnjoymentBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        attachment = await fp.upload_file(
            file_url="https://images.pexels.com/photos/46254/leopard-wildcat-big-cat-botswana-46254.jpeg",
            file_name="leopard.jpeg",
            api_key=request.access_key,
        )
        last_msg = request.query[-1]
        new_text = f"Will the user like this image? User message: {last_msg.content}"
        new_msg = last_msg.model_copy(
            update={"content": new_text, "attachments": [attachment]}
        )
        new_request = request.model_copy(update={"query": [new_msg]})
        async for msg in fp.stream_request(
            new_request, "Claude-Sonnet-4.6", request.access_key
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"Claude-Sonnet-4.6": 1})

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("LeopardEnjoymentBot-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = LeopardEnjoymentBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

### [Receiving Files from a Bot Response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#receiving-files-from-a-bot-response)

If you called an image/video/audio generation bot (or any other bot that outputs file attachments) on Poe, you will receive a [PartialResponse](https://creator.poe.com/docs/server-bots/fastapi_poe-python-reference#fppartialresponse) object with the attachment in the `attachment` field for every file it outputs.

```
class Imagen3Bot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:

        sent_files = []
        async for msg in fp.stream_request(
            request, "Imagen-4", request.access_key
        ):
            # Add whatever logic you'd like to handle text responses from the Bot
            pass
            # If there is an attachment, add it to the list of sent files
            if msg.attachment:
                sent_files.append(msg.attachment)

        # This re-attaches the received files to this bot's output
        for file in sent_files:
            await self.post_message_attachment(
                message_id=request.message_id,
                download_url=file.url,
            )

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"Imagen-4": 1})
```

In this example, we take the received files and attach them to the output. For more information on attaching files to your bot's output, see the "Sending files with your response" section below.

## [Rendering an image in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#rendering-an-image-in-your-response)

The Poe API allows you to embed images in your bot's response using Markdown syntax. The following is an example implementation describing a bot that returns a static response containing an image.

```
IMAGE_URL = "https://images.pexels.com/photos/46254/leopard-wildcat-big-cat-botswana-46254.jpeg"

class SampleImageResponseBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        yield fp.PartialResponse(text=f"This is a test image. ![leopard]({IMAGE_URL})")
```

```
from typing import AsyncIterable
from modal import App, Image, asgi_app, exit
import fastapi_poe as fp

IMAGE_URL = "https://images.pexels.com/photos/46254/leopard-wildcat-big-cat-botswana-46254.jpeg"

class SampleImageResponseBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        yield fp.PartialResponse(text=f"This is a test image. ![leopard]({IMAGE_URL})")

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("imageresponse-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = SampleImageResponseBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    # app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    app = fp.make_app(bot, allow_without_key=True)
    return app
```

The following is what the response looks like for someone using the above described bot.

![Image](https://files.readme.io/0c8c4a4-image.png)

## [Rendering HTML in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#rendering-html-in-your-response)

### [Using a HTML code block](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#using-a-html-code-block)

If a Markdown message contains a HTML code block, both the code block and the preview will be rendered. Note that the code block content must begin with `<html>`.

For example the following message:

```
<html>
  <h1>hello world</h1>
</html>
```

Will render like this:

![Image](https://files.readme.io/b5e8dff-image.png)

### [Using inline HTML](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#using-inline-html)

If a bot's Markdown output contains a `<html>` block outside a code block, the HTML block will be rendered without displaying the code.

The following message:

```
<html>
   <h1>hello world</h1>
</html>
```

Will render like this:

![Image](https://files.readme.io/31c83c4-image.png)

> ❗️ Avoid Empty Lines
>
> The HTML block should not contain any empty lines, as Markdown will interpret these as separate blocks, breaking the HTML structure.

### [Embedding an iframe in a message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#embedding-an-iframe-in-a-message)

When a bot's markdown output contains `<iframe src="{{url}}" />` outside of a code block, the iframe will be rendered. For best results, always include the height attribute.

The following message:

```
<iframe
  height="315"
  src="https://www.youtube.com/embed/GBxblAUN3ro?si=K9BxwGdjexz1Vf_4"></iframe>
```

Will render like this:

![Image](https://files.readme.io/65251f4b045a00c6696fc26f8c5e76e1c2129751aecbfde3fbc06f598c97608d-image.png)

### [Prompting LLMs to generate HTML](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#prompting-llms-to-generate-html)

If your bot calls an LLM and you want it to be able to generate HTML which works well across a variety of use cases on Poe, you can include this text in the system prompt.

```
Follow these guidelines for your responses:
    * Only if the user explicitly requests web applications, visual aids, interactive tools, or games, you may generate them using HTML code. These visual aids can include presentations, illustrations, diagrams, graphs, and charts.
    * If you generate HTML code, ensure your HTML code is responsive and adapts well to narrow mobile screens.
    * If you generate HTML code, ensure your HTML code is a complete and self-contained HTML code block. Enclose your HTML code within a Markdown code block. Include any necessary CSS or JavaScript within the same code block.
    * Do not use image URLs or audio URLs, unless the URL is provided by the user. Assume you can access only the URLs provided by the user. Most images and other static assets should be programmatically generated.
    * If you modify existing HTML, CSS, or JavaScript code, always provide the full code in its entirety, even if your response becomes too long. Do not use shorthands like "... rest of the code remains the same ..." or "... previous code remains the same ...".
```

## [Enabling file upload for your bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#enabling-file-upload-for-your-bot)

The Poe API allows your bot to take files as input. There are several settings designed to streamline the process of enabling file uploads for your bot:

- `allow_attachments` (default `True`): Turning this on will allow Poe users to send files to your bot. Attachments will be sent as attachment objects with url, content\_type, and name.
- `expand_text_attachments` (default `True`): If `allow_attachments=True`, Poe will parse text files and send their content in the `parsed_content` field of the attachment object.
- `enable_image_comprehension` (default `False`): If `allow_attachments=True`, Poe will use image vision to generate a description of image attachments and send their content in the `parsed_content` field of the attachment object. If this is enabled, the Poe user will only be able to send at most one image per message due to image vision limitations.

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(
      allow_attachments=True, expand_text_attachments=True, enable_image_comprehension=True
    )
```

That's it! Your bot should now be able to handle image and text attachments in addition to the user's chat input. 🎉

**Note**: If you have either attachment parsing setting on (`expand_text_attachments` or `enable_image_comprehension`), `fastapi_poe` will automatically add user-role messages containing each file's `parsed_content` into the conversation prior to the last user message. See [templates.py](https://github.com/poe-platform/fastapi_poe/blob/main/src/fastapi_poe/templates.py) for how the file contents are added. Note that because this adds additional user-role messages to the conversation, if the LLM you are using requires role alternation between the bot and the user, you will need to reformat the conversation. `make_prompt_author_role_alternated` is provided to help with that.

If you would like to disable the file content insertion, you can use `should_insert_attachment_messages=False` when initializing your PoeBot class. You can also override `insert_attachment_messages()` if you want to use your own templates.

```
bot = YourBot(should_insert_attachment_messages=False)
app = make_app(bot)
```

### [Parsing your own files](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#parsing-your-own-files)

If your expected filetypes are not supported, or you want to perform more complex operations and would rather handle the file contents yourself, that is also possible using the file url, which is passed in through the attachment object. Here is an example of setting up a bot which counts the number of pages in a PDF document.

We will utilize a python library called `pypdf2` (which you can install using `pip install pypdf2`) to parse the pdf and count the number of pages. We will use the `requests` library (which you can install using `pip install requests`) to download the file.

```
def _fetch_pdf_and_count_num_pages(url: str) -> int:
    response = requests.get(url)
    if response.status_code != 200:
        raise FileDownloadError()
    with open("temp_pdf_file.pdf", "wb") as f:
        f.write(response.content)
    reader = PdfReader("temp_pdf_file.pdf")
    return len(reader.pages)
```

Now we will set up a bot class that will iterate through the user messages and identify the latest pdf file to compute the number of pages for.

```
class PDFSizeBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        for message in reversed(request.query):
            for attachment in message.attachments:
                if attachment.content_type == "application/pdf":
                    try:
                        num_pages = _fetch_pdf_and_count_num_pages(attachment.url)
                        yield fp.PartialResponse(text=f"{attachment.name} has {num_pages} pages")
                    except FileDownloadError:
                        yield fp.PartialResponse(text="Failed to retrieve the document.")
                    return
```

The final code should look like:

```
class FileDownloadError(Exception):
    pass

def _fetch_pdf_and_count_num_pages(url: str) -> int:
    response = requests.get(url)
    if response.status_code != 200:
        raise FileDownloadError()
    with open("temp_pdf_file.pdf", "wb") as f:
        f.write(response.content)
    reader = PdfReader("temp_pdf_file.pdf")
    return len(reader.pages)

class PDFSizeBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        for message in reversed(request.query):
            for attachment in message.attachments:
                if attachment.content_type == "application/pdf":
                    try:
                        num_pages = _fetch_pdf_and_count_num_pages(attachment.url)
                        yield fp.PartialResponse(text=f"{attachment.name} has {num_pages} pages")
                    except FileDownloadError:
                        yield fp.PartialResponse(text="Failed to retrieve the document.")
                    return

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(allow_attachments=True)
```

```
from __future__ import annotations
from typing import AsyncIterable
import requests
from PyPDF2 import PdfReader
import fastapi_poe as fp

from modal import App, Image, asgi_app, exit

class FileDownloadError(Exception):
    pass

def _fetch_pdf_and_count_num_pages(url: str) -> int:
    response = requests.get(url)
    if response.status_code != 200:
        raise FileDownloadError()
    with open("temp_pdf_file.pdf", "wb") as f:
        f.write(response.content)
    reader = PdfReader("temp_pdf_file.pdf")
    return len(reader.pages)

class PDFSizeBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        for message in reversed(request.query):
            for attachment in message.attachments:
                if attachment.content_type == "application/pdf":
                    try:
                        num_pages = _fetch_pdf_and_count_num_pages(attachment.url)
                        yield fp.PartialResponse(text=f"{attachment.name} has {num_pages} pages")
                    except FileDownloadError:
                        yield fp.PartialResponse(text="Failed to retrieve the document.")
                    return

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(allow_attachments=True)

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("pdfsizebot-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = PDFSizeBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

## [Sending files with your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#sending-files-with-your-response)

The Poe API allows you to send attachments with your bot response. When using the `fastapi_poe` library, send file attachments with your bot response by calling `post_message_attachment` within the `get_response` function of your bot.

### [**Example**](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#example)

In this example, the bot will take the input from the user, write it into a text file, and attach that text file in the response to the user. Copy the following code into a file called `main.py` (you can pick any name but the deployment commands that follow assume that this is the file name). Change the `access_key` stub with your actual key that you can generate on the [create bot](https://poe.com/create_bot) page.

```
class AttachmentOutputDemoBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        await self.post_message_attachment(
           message_id=request.message_id, file_data=request.query[-1].content, filename="dummy.txt"
        )
        yield fp.PartialResponse(text=f"Attached a text file containing your last message.")
```

```
from __future__ import annotations
from typing import AsyncIterable
import fastapi_poe as fp
from modal import App, Image, asgi_app

class AttachmentOutputDemoBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        await self.post_message_attachment(
           message_id=request.message_id, file_data=request.query[-1].content, filename="dummy.txt"
        )
        yield fp.PartialResponse(text=f"Attached a text file containing your last message.")

REQUIREMENTS = ["fastapi-poe==0.0.48"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("attachment-output-demo-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = AttachmentOutputDemoBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    # app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    app = fp.make_app(bot, allow_without_key=True)
    return app
```

> 📘 Limitations
>
> - The `access_key` should be the key associated with the bot sending the response. It can be found in the edit bot page.
> - It does not matter where `post_message_attachment` is called, as long as it is within the body of `get_response`. It can be called multiple times to attach multiple (up to 20) files.
> - A file should not be larger than 50MB.

### [Rendering an audio player in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#rendering-an-audio-player-in-your-response)

If an attachment is an audio file, you'll see an audio player display. The following is an example implementation describing a bot that returns a response containing an audio file.

```
AUDIO_URL = "..."

class AttachmentOutputDemoBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        await self.post_message_attachment(
           message_id=request.message_id, download_url=AUDIO_URL
        )
        yield fp.PartialResponse(text="Hi")
```

![Image](https://files.readme.io/6fd02917dde2644a091175c00c13ea6ba9d54b9c83120c9fd6bf24f82b85d3b0-Screenshot_2024-11-19_at_16.47.25.png)

Our audio player currently supports the following file types:

- `audio/mpeg` (mp3)
- `audio/wav`
- `audio/mp4`
- `audio/webm`

### [Rendering a video player in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#rendering-a-video-player-in-your-response)

If an attachment is one of the following: quicktime, mpeg, mp4, mpg, avi, x-msvideo, x-ms-wmv, or x-flv you'll see an video player display. The following is an example implementation describing a bot that returns a response containing an video file.

```
VIDEO_URL = "..."

class AttachmentOutputDemoBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        await self.post_message_attachment(
           message_id=request.message_id, download_url=VIDEO_URL
        )
        yield fp.PartialResponse(text="")
```

![Image](https://files.readme.io/c0551f6575dca96e7825dd11a160bec38c15673e601a9f4dfc6afd03ec80e44c-Screenshot_2024-11-19_at_16.49.49.png)

## [Creating bots that help their users create prompt bots](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#creating-bots-that-help-their-users-create-prompt-bots)

Your bot can help users create prompt bots with pre-filled fields. Here are some example use-case for this:

- Your bot helps users do prompt engineering, then provides a link the user can use to create a bot easily with the prompt they have developed.
- When a user uploads training data, your bot could run fine-tuning and provide a link to create a new prompt bot. This new bot's prompt would include the fine-tuned model ID, which its base bot can extract from the prompt to do inference.

More specifically, your bot’s response can contain a link to pre-fill the form fields on [poe.com/create\_bot](http://poe.com/create_bot) by passing GET parameters. The user can submit the form as-is or manually edit before submitting. The supported GET parameters are:

- `prompt` — this is the string which will pre-fill the prompt section on the form.
- `base_bot` — this is the string name for a bot to pre-select from the base bot list on the form.\*

```
import urllib

class FineTuneTrainingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        fine_tune_id = my_api.generate_fine_tune_id(request)
        params = {
          "prompt": f"{{user_prompt}} --fine-tune-id {fine_tune_id}",
          "base_bot": "FineTuneInferenceBot"
        }
        url_base = "https://poe.com/create_bot?"
        url_params = urllib.parse.urlencode(params)
        yield fp.PartialResponse(
              text=f"[Finish creating your bot.]({url_base}{url_params})")
```

\*If you are interested in including your bot in this list, please reach out to [developers@poe.com](mailto:developers@poe.com)

## [Setting an introduction message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#setting-an-introduction-message)

The Poe API allows you to set a friendly introduction message for your bot, providing you with a way to instruct the users on how they should use the bot. In order to do so, you have to override `get_settings` and set the parameter called `introduction_message` to whatever you want that message to be.

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(
        introduction_message="Welcome to the trivia bot. Please provide me a topic that you would like me to quiz you on."
    )
```

The final code looks like:

```
class TriviaBotSample(fp.PoeBot):
    async def get_response(self, query: fp.QueryRequest) -> AsyncIterable[fp.PartialResponse]:
        # implement the trivia bot.
        yield fp.PartialResponse(text="Bot under construction. Please visit later")

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(
            introduction_message="Welcome to the trivia bot. Please provide me a topic that you would like me to quiz you on."
        )
```

```
from __future__ import annotations
from typing import AsyncIterable
from modal import App, Image, asgi_app
import fastapi_poe as fp

class TriviaBotSample(fp.PoeBot):
    async def get_response(self, query: fp.QueryRequest) -> AsyncIterable[fp.PartialResponse]:
        # implement the trivia bot.
        yield fp.PartialResponse(text="Bot under construction. Please visit later")

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(
            introduction_message="Welcome to the trivia bot. Please provide me a topic that you would like me to quiz you on."
        )

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("trivia-bot-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = TriviaBotSample()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    # app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    app = fp.make_app(bot, allow_without_key=True)
    return app
```

## [Multi Entity Support](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#multi-entity-support)

The Poe client support @-mentioning other bots & interacting with other users within the same chat. To include this support in with your bot, you need to enable `enable_multi_entity_prompting` (Default True) in your bot settings. When this is enabled, Poe will check the previous chat history to see if there are multiple bots/users, and if so, it will add prompting such that your bot will have sufficient context about the conversation so far.

If this setting is not enabled, you will continue to see unmodified bot/user messages just like before.

## [Updating bot settings](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#updating-bot-settings)

Bots on poe each have [settings](https://creator.poe.com/docs/server-bots/poe-protocol-specification#settings) that control how the bot behaves. For example, one such setting is `server_bot_dependencies`, which allows you to call other bots on poe (see the "Calling other bots on Poe" section above). It is important to note that after modifying these settings, (i.e. after modifying `get_settings()` in your `PoeBot` class), these updates still need to be sent to the Poe servers. This is typically done automatically on server bot startup, within fastapi\_poe's make\_app function,

> ❗️ Warning!!!
>
> If you are not using `fastapi_poe` or you do not provide the `access_key` and `bot_name` into make\_app() (see [configuring access credentials](https://creator.poe.com/docs/server-bots/quick-start#configuring-the-access-credentials)), **you will need to manually sync these settings** using the steps below.

#### [1\. Modify the bot settings to your desired specification](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#1-modify-the-bot-settings-to-your-desired-specification)

If you are using the `fastapi_poe` library, then you just need to implement the `get_settings` method in the `PoeBot` class. The following is an example:

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(allow_attachments=True, server_bot_dependencies={"GPT-5.4": 1, "Claude-Sonnet-4.6": 1})
```

#### [2\. Get your access key and bot name](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#2-get-your-access-key-and-bot-name)

You can find both the access key and the bot name in the "edit bot" page by clicking on your bot -`> clicking the triple dots ->` edit bot.

![Image](https://files.readme.io/45f8a6d-image.png)

#### [3\. Make a post request to Poe's refetch settings endpoint with your bot name and access key.](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#3-make-a-post-request-to-poes-refetch-settings-endpoint-with-your-bot-name-and-access-key)

This is done by calling`fp.client.sync_bot_settings` from within a python script.

```
import fastapi_poe as fp

# Replace the bot name and access key with information of your bot
bot_name = "server_bot_name"
access_key = "your_server_bot_access_key"

fp.sync_bot_settings(bot_name, access_key)
```

If you are not using the python `fastapi_poe` library, you can also use `curl`:

`curl -X POST https://api.poe.com/bot/fetch_settings/<botname>/<access_key>`

Note that it is highly recommended to use `fastapi_poe`, and some features may not work smoothly without it.

## [Using OpenAI function calling](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#using-openai-function-calling)

The Poe API allows you to use OpenAI function calling when accessing OpenAI models. In order to use this feature, you will simply need to provide a tools list which contains objects describing your function and an executables list which contains functions that correspond to the tools list. The following is an example.

```
def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    if "tokyo" in location.lower():
        return json.dumps({"location": "Tokyo", "temperature": "11", "unit": unit})
    elif "san francisco" in location.lower():
        return json.dumps(
            {"location": "San Francisco", "temperature": "72", "unit": unit}
        )
    elif "paris" in location.lower():
        return json.dumps({"location": "Paris", "temperature": "22", "unit": unit})
    else:
        return json.dumps({"location": location, "temperature": "unknown"})

tools_executables = [get_current_weather]

tools_dict_list = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_current_weather",\
            "description": "Get the current weather in a given location",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "location": {\
                        "type": "string",\
                        "description": "The city and state, e.g. San Francisco, CA",\
                    },\
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},\
                },\
                "required": ["location"],\
            },\
        },\
    }\
]
tools = [fp.ToolDefinition(**tools_dict) for tools_dict in tools_dict_list]
```

Additionally, you will need to define a dependency of two calls on an OpenAI model of your choice (in this case, the GPT-5.4). You need a dependency of two because as part of the OpenAI function calling [flow](https://platform.openai.com/docs/guides/function-calling/common-use-cases), you need to call OpenAI twice. Adjust this dependency limit if you want to make more than one function calling request while computing your response.

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 2})
```

The final code (including the setup code you need to host this on [Modal](https://modal.com/)) that goes into your `main.py` is as follows:

```
def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    if "tokyo" in location.lower():
        return json.dumps({"location": "Tokyo", "temperature": "11", "unit": unit})
    elif "san francisco" in location.lower():
        return json.dumps(
            {"location": "San Francisco", "temperature": "72", "unit": unit}
        )
    elif "paris" in location.lower():
        return json.dumps({"location": "Paris", "temperature": "22", "unit": unit})
    else:
        return json.dumps({"location": location, "temperature": "unknown"})

tools_executables = [get_current_weather]

tools_dict_list = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_current_weather",\
            "description": "Get the current weather in a given location",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "location": {\
                        "type": "string",\
                        "description": "The city and state, e.g. San Francisco, CA",\
                    },\
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},\
                },\
                "required": ["location"],\
            },\
        },\
    }\
]
tools = [fp.ToolDefinition(**tools_dict) for tools_dict in tools_dict_list]

class MyFunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request,
            "GPT-5.4",
            request.access_key,
            tools=tools,
            tool_executables=tools_executables,
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 2})
```

```
from __future__ import annotations

import json
from typing import AsyncIterable

import fastapi_poe as fp
from modal import App, Image, asgi_app, exit

def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    if "tokyo" in location.lower():
        return json.dumps({"location": "Tokyo", "temperature": "11", "unit": unit})
    elif "san francisco" in location.lower():
        return json.dumps(
            {"location": "San Francisco", "temperature": "72", "unit": unit}
        )
    elif "paris" in location.lower():
        return json.dumps({"location": "Paris", "temperature": "22", "unit": unit})
    else:
        return json.dumps({"location": location, "temperature": "unknown"})

tools_executables = [get_current_weather]

tools_dict_list = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_current_weather",\
            "description": "Get the current weather in a given location",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "location": {\
                        "type": "string",\
                        "description": "The city and state, e.g. San Francisco, CA",\
                    },\
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},\
                },\
                "required": ["location"],\
            },\
        },\
    }\
]
tools = [fp.ToolDefinition(**tools_dict) for tools_dict in tools_dict_list]

class GPT5FunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request,
            "GPT-5.4",
            request.access_key,
            tools=tools,
            tool_executables=tools_executables,
        ):
            yield msg

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(server_bot_dependencies={"GPT-5.4": 2})

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("functioncalling-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = GPT5FunctionCallingBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

![Image](https://files.readme.io/a293e19-image.png)

## [Storing Metadata with a Bot Response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#storing-metadata-with-a-bot-response)

Bots can persist additional data about their response by yielding a `DataResponse`. This metadata is stored in the `metadata` field of the associated `ProtocolMessage` and will be available in future requests to the same bot. This enables state management across multiple messages in a conversation without exposing internal details to users.

For example, consider some troubleshooting bot that uses metadata to track which diagnostic steps have been attempted:

```
class TroubleShootingBot(fp.PoeBot):
  async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:

        diagnosis_steps_to_directions = {
            "Check printer light": "Check the light on the top of the printer.",
            "Check connection": "Check the printer is connected to wifi.",
            "Check drivers": "Check your device has the latest drivers."
        }

        # Access metadata to remove steps that have already been tried.
        for prev_message in request.query:
            if prev_message.role == "bot" and prev_message.metadata is not None:
                message_metadata = json.loads(prev_message.metadata)
                if message_metadata.get("diagnosis_step") is not None:
                    diagnosis_steps_to_directions.pop(message_metadata["diagnosis_step"])

        # If there are no remaining steps, return a message saying so.
        if not diagnosis_steps_to_directions:
            yield fp.PartialResponse(text="I've tried everything.")
            return

        # Recommend a next step
        recommended_next_step = random.choice(list(diagnosis_steps_to_directions.keys()))
        yield fp.PartialResponse(text=diagnosis_steps_to_directions[recommended_next_step])

        # Persist the recommended step in the message metadata
        yield fp.DataResponse(
            metadata=json.dumps({"diagnosis_step": recommended_next_step}),
        )
```

Beyond storing conversation state, `DataResponse` can also be useful for persisting data that doesn't make sense to expose to the user, like identifiers or performance metrics.

> 📘 Important Notes
>
> - Only yield one `DataResponse` per request - if multiple are sent, only the last one is stored
> - Metadata is only visible to the bot that created it - so using this field to pass data between bots will not work.

## [Accessing HTTP request information](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#accessing-http-request-information)

In the special case that you need to access specific http information about the requests coming to your bot, our python client ( [fastapi\_poe](https://github.com/poe-platform/fastapi_poe)) exposes the underlying Starlette [Request](https://www.starlette.io/requests/) object in the ".http\_request" attribute of the request object passed to the query handler. This allows you to access the request information such as the url and query params. The following is an example (including the setup code you need to host this on [Modal](https://modal.com/)):

```
class HttpRequestBot(fp.PoeBot):
    async def get_response_with_context(
        self, request: fp.QueryRequest, context: fp.RequestContext
    ) -> AsyncIterable[fp.PartialResponse]:
        request_url = context.http_request.url
        query_params = context.http_request.query_params
        yield fp.PartialResponse(
            text=f"The request url is: {request_url}, query params are: {query_params}"
        )
```

```
from __future__ import annotations

from typing import AsyncIterable

import fastapi_poe as fp
from modal import App, Image, asgi_app, exit

class HttpRequestBot(fp.PoeBot):
    async def get_response_with_context(
        self, request: fp.QueryRequest, context: fp.RequestContext
    ) -> AsyncIterable[fp.PartialResponse]:
        request_url = context.http_request.url
        query_params = context.http_request.query_params
        yield fp.PartialResponse(
            text=f"The request url is: {request_url}, query params are: {query_params}"
        )

REQUIREMENTS = ["fastapi-poe==0.0.63"]
image = Image.debian_slim().pip_install(*REQUIREMENTS)
app = App("http-request-poe")

@app.function(image=image)
@asgi_app()
def fastapi_app():
    bot = HttpRequestBot()
    # see /docs/server-bots/quick-start#configuring-the-access-credentials
    app = fp.make_app(bot, access_key=<YOUR_ACCESS_KEY>, bot_name=<YOUR_BOT_NAME>)
    return app
```

## [Programmatically Accessing a Poe Bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides\#programmatically-accessing-a-poe-bot)

For certain use cases, like running unit tests or other offline computation outside the context of a particular request to your server bot, or to do queries that you as a creator want to use your own Poe account to pay for (as opposed to offloading those costs to a user), you may want to query other Poe bots under your own API key. See the [External Application Guide](https://creator.poe.com/docs/external-applications/external-application-guide) for more details on how to do this.

On this page

[Calling other bots on Poe](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#calling-other-bots-on-poe) [Declare dependencies in your PoeBot class](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#declare-dependencies-in-your-poebot-class) [Forwarding the User Conversation](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#forwarding-the-user-conversation) [Sending a Customized Message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#sending-a-customized-message) [Sending Files as Part of the Query to Another Bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#sending-files-as-part-of-the-query-to-another-bot) [Receiving Files from a Bot Response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#receiving-files-from-a-bot-response) [Rendering an image in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#rendering-an-image-in-your-response) [Rendering HTML in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#rendering-html-in-your-response) [Using a HTML code block](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#using-a-html-code-block) [Using inline HTML](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#using-inline-html) [Embedding an iframe in a message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#embedding-an-iframe-in-a-message) [Prompting LLMs to generate HTML](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#prompting-llms-to-generate-html) [Enabling file upload for your bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#enabling-file-upload-for-your-bot) [Parsing your own files](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#parsing-your-own-files) [Sending files with your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#sending-files-with-your-response) [**Example**](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#example) [Rendering an audio player in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#rendering-an-audio-player-in-your-response) [Rendering a video player in your response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#rendering-a-video-player-in-your-response) [Creating bots that help their users create prompt bots](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#creating-bots-that-help-their-users-create-prompt-bots) [Setting an introduction message](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#setting-an-introduction-message) [Multi Entity Support](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#multi-entity-support) [Updating bot settings](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#updating-bot-settings) [1\. Modify the bot settings to your desired specification](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#1-modify-the-bot-settings-to-your-desired-specification) [2\. Get your access key and bot name](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#2-get-your-access-key-and-bot-name) [3\. Make a post request to Poe's refetch settings endpoint with your bot name and access key.](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#3-make-a-post-request-to-poes-refetch-settings-endpoint-with-your-bot-name-and-access-key) [Using OpenAI function calling](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#using-openai-function-calling) [Storing Metadata with a Bot Response](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#storing-metadata-with-a-bot-response) [Accessing HTTP request information](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#accessing-http-request-information) [Programmatically Accessing a Poe Bot](https://creator.poe.com/docs/server-bots/server-bots-functional-guides#programmatically-accessing-a-poe-bot)