---
url: "https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots"
title: "Best practices for image generation prompts | Poe Creator Platform"
---

# Best practices for image generation prompts

Copy for LLMView as Markdown

You can build image generation prompt bots on top of several available models, including:

- [GPT-Image-1.5](https://poe.com/GPT-Image-1.5)
- [Imagen-4](https://poe.com/Imagen-4)
- [FLUX-pro-1.1](https://poe.com/FLUX-pro-1.1)
- [DALL-E-3](https://poe.com/DALL-E-3)
- [StableDiffusionXL](https://poe.com/StableDiffusionXL)
- [FLUX-pro](https://poe.com/FLUX-pro)
- [FLUX-schnell](https://poe.com/FLUX-schnell)
- [FLUX-dev](https://poe.com/FLUX-dev)

These bots support [templating](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#templating) when used as a base bot.

## [Prompting tips](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots\#prompting-tips)

1. **Be descriptive, rather than instructive**. Unlike for text generation bots, the style prompt should describe the desired image, **not** be an instruction to the bot. This is especially true for StableDiffusionXL, Playground-v2.5 and Playground-v3. For example, to generate paintings in the style of Vincent Van Gogh:

**Instead of:**

```
You are VanGoghBot. You will generate paintings in the style of Van Gogh.
```

**Try:**

```
painting, Van Gogh
```

2. **Be specific in your prompt:** The more specific and detailed your prompt is, the better the chances of getting the desired image. Instead of using a generic term like `landscape`, try specifying elements like `sunset over a beach with palm trees`. You can also specify multiple elements or style descriptions separated by punctuations, e.g. `beautiful sunset, rain, painting, Van Gogh`.
3. **Utilize the** [**negative prompt**](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#negative-prompts) **(StableDiffusionXL, Playground-v2.5 and Playground-v3 only):** If there are certain elements you don't want in your image, use the negative prompt feature. For example, if you don't want any buildings in your landscape, include `buildings` in your negative prompt.

### [How do style prompts and user prompts get merged?](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots\#how-do-style-prompts-and-user-prompts-get-merged)

By default, style prompts and user prompts get concatenated.

For example, with a **style prompt**:

```
cartoon --no color
```

and a **user prompt**:

```
dog --no cat
```

The **final prompt** will be:

```
dog, cartoon --no cat, color
```

**Note:** the `--no` parameter is only accepted by StableDiffusionXL.

### [Templating](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots\#templating)

Poe also supports Jinja templating for image generation bots to provide bot creators with flexibility over how style prompts and user prompts get merged.

Specifically, specify a `{{user_prompt}}` in either (or both!) of the style prompt and negative prompts to indicate where the user's prompt and negative prompts should go, respectively.

For example, with a **style prompt**:

```
happy, smiling {{user_prompt}} on a skateboard --no scooter, {{user_prompt}}, cartoon
```

and a **user prompt**:

```
dog --no cat
```

the **final prompt** will be:

```
happy, smiling dog on a skateboard --no scooter, cat, cartoon
```

### [Negative prompts](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots\#negative-prompts)

Specify a `--no` parameter to indicate elements that should be avoided in the generated image. For example:

![Image](https://files.readme.io/f35c0f8-image.png)

On this page

[Prompting tips](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#prompting-tips) [How do style prompts and user prompts get merged?](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#how-do-style-prompts-and-user-prompts-get-merged) [Templating](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#templating) [Negative prompts](https://creator.poe.com/docs/prompt-bots/best-practices-image-generation-bots#negative-prompts)