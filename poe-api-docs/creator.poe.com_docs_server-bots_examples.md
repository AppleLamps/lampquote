---
url: "https://creator.poe.com/docs/server-bots/examples"
title: "Example Bots | Poe Creator Platform"
---

# Example Bots

Copy for LLMView as Markdown

These bots are all server bots built on the API. You can try each of them live in Poe by clicking the link.

- [**Clothing recommendation bot**](https://poe.com/TopRecommender)
  - An example bot that takes in a user-uploaded image, analyzes it with Claude-Sonnet-4.6 to recommend a new top, and then generates an image of the new clothing with Imagen-4 to return to the user.
  - This is a good starting point for handling user-uploaded attachments, and also returning attachments with your bot.
    - [https://github.com/poe-platform/server-bot-quick-start/blob/main/new\_top\_recommender.py](https://github.com/poe-platform/server-bot-quick-start/blob/main/new_top_recommender.py)
- [**Python Code Runner**](https://poe.com/PythonCodeRunner)
  - An example bot that generates code based on the user query, runs it with the @Python bot, and attempts to debug it if theres any issues.
  - This is a good starting point for chaining requests to various text models.
    - [https://github.com/poe-platform/server-bot-quick-start/blob/main/python\_runner.py](https://github.com/poe-platform/server-bot-quick-start/blob/main/python_runner.py)
- [**GPT-4o-mini**](https://poe.com/GPT-4o-Mini)
  - This bot uses OpenAI client to generate chat completions for the user's conversation.
  - A simplified version of the source code can be found at:
    - [https://github.com/poe-platform/server-bot-quick-start/blob/main/wrapper\_bot.py](https://github.com/poe-platform/server-bot-quick-start/blob/main/wrapper_bot.py)
    - This is a good starting point for building a conversational bot with OpenAI's client library.
- [**StableDiffusionXL**](https://poe.com/StableDiffusionXL)
  - This bot uses SDXL to generate an image for the user based on their prompt.
  - A simplified version of the source code can be found at:
    - [https://github.com/poe-platform/server-bot-quick-start/blob/main/sdxl\_bot.py](https://github.com/poe-platform/server-bot-quick-start/blob/main/sdxl_bot.py)
    - This is a good starting point for building your own image generation bot.
- [**Mixtral-8x7B-Chat**](https://poe.com/Mixtral-8x7B-Chat)
  - Created by [Fireworks](https://www.fireworks.ai/), this bot provides access to [Mixtral 8x7B Mixture-of-Experts](https://mistral.ai/news/mixtral-of-experts/).
  - Reference code for this bot, along with other Fireworks-hosted bots on Poe can be found at:
    - [https://github.com/fw-ai/fireworks\_poe\_bot](https://github.com/fw-ai/fireworks_poe_bot)
- [**Function calling bot**](https://poe.com/FunctionCallLoopDemo)
  - An example bot that manages a function calling loop to get tool suggestions from the LLM, execute them on the server bot, and pass the execution results back to the LLM for further input.
    - [https://github.com/poe-platform/server-bot-quick-start/blob/main/function\_calling\_loop\_bot.py](https://github.com/poe-platform/server-bot-quick-start/blob/main/function_calling_loop_bot.py)