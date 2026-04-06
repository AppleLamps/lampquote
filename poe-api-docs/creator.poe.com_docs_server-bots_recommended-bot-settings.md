---
url: "https://creator.poe.com/docs/server-bots/recommended-bot-settings"
title: "Recommended Bot Settings | Poe Creator Platform"
---

# Recommended Bot Settings

Copy for LLMView as Markdown

There are various settings that can be applied to your bot. For the best user experience we recommend turning on the following setting for all text-based bots without native vision capabilities:

- `enable_image_comprehension=True`: Poe converts images into text prompts using a vision model
  - You should enable this for models which doesn’t support multimodality yet.