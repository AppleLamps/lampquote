---
url: "https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start"
title: "Quick Start | Poe Creator Platform"
---

# Quick Start

Copy for LLMView as Markdown

## [What are Canvas apps?](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#what-are-canvas-apps)

Canvas apps are interactive web applications hosted on Poe. Unlike chat-based bots, Canvas apps provide custom visual interfaces for any kind of interactive experience. They can interact with the Poe environment in various ways - including calling models on Poe and using their responses in the app - enabling creators to develop applications ranging from simple tools and games to advanced AI-powered experiences. And using the [App Creator](https://poe.com/App-Creator) bot, anyone can bring their ideas to life just by describing them - **no coding required**.

### [Examples of Canvas apps](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#examples-of-canvas-apps)

- Simple (non-AI-powered) tools or games
  - Example: [ColorPicker](https://poe.com/ColorPicker) \- Pick any color from your images and instantly get its HEX and RGB values.

![Image](https://files.readme.io/428b947211facc198bdf4bc5409b77c1dbef3f5f9b2b6fdbc8987041362854b5-image.png)

- Custom interfaces for single AI models
  - Example: [MagicErase](https://poe.com/MagicErase) \- Remove unwanted objects from images using AI! Powered by [Bria-Eraser](https://poe.com/Bria-Eraser).

![Image](https://files.readme.io/59e3b49fa783f44f84f534fe1d295ab7514423d9795d6ffb97f5ca1f24c9dfe1-image.png)

Advanced AI workflows involving multiple models

- Example: [Chibify](https://poe.com/Chibify) \- Transform any image into 3D Chibi art! Powered by GPT-4o and FLUX Pro 1.1.

![Image](https://files.readme.io/3d05499a843ee9680dd68686bd58dec6a312a775d09ef1dbc751255981a9294a-image.png)

- Example: [MemeGenBattle](https://poe.com/MemeGenBattle) \- Pit AI models against each other in a meme generation showdown!

![Image](https://files.readme.io/bac1478858ba2a6287d940b89995787de88eea25f66e0fd53c81440c02e243c7-image.png)

## [Getting started](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#getting-started)

Let's walk through the process of creating your first Canvas app:

1. **Initial setup**
1. Click on the “Create” button in the left sidebar or visit [poe.com/create\_bot](https://poe.com/create_bot)
2. Select "Canvas app" as the type

![Image](https://files.readme.io/a88f651e708ab6fcacb4ac6da36ace1fd9ecc79a6844c1cad6acb1db9026fc5c-image.png)

2. **Choose your creation method**
1. Generate with a bot **(Recommended - the following steps assume choosing this option)**
      1. Chat with [App Creator](https://poe.com/App-Creator) and describe what you want to create
2. Build manually
      1. Provide your own application code

![Image](https://files.readme.io/7cdfec0f2174922bfaab82a40f4a17fed271e7056eeea5628d572eacb405e0f0-image.png)

3. **Describe your idea to [App Creator](https://poe.com/App-Creator) and iterate as needed**
1. Example: “Create an interactive color picker tool that allows users to upload their own images”
2. Potential followups could be:
      1. “Add a smooth transition animation when an image is uploaded”
      2. “Show the history of chosen colors below the image”
      3. “Add a feature that uses an AI model to suggest complementary colors”
         1. or specifically e.g. “@GPT-4o-mini” instead of “an AI model”
4. **Publish your app on Poe**
1. Click “Publish” in the Canvas to share your application with others

![Image](https://files.readme.io/f57ea9661360e30aba2263138eeb1071ff8c7494a0bf1b4a220fce187a86efa1-image.png)

5. **Editing your app**
1. To edit your app after publishing, click “Edit app” in the overflow menu of your app
2. Click “Edit with @App-Creator” to use App Creator to iterate on the app
3. When you’re ready to publish the application again, click “Publish” in the Canvas to update your app.

![Image](https://files.readme.io/c572789057d96cf5b8f40e51130703f1838c559320b4f1139a3bb4fae3cd1b7d-image.png)

## [Canvas app development UI](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#canvas-app-development-ui)

The Canvas app development environment has two key components:

![Image](https://files.readme.io/85fb11a63f0389ec674aa18f192e7a7a3fc990c8d66cee348214994ad19dc6cc-image.png)

1. **Chat Interface (left)**
1. Chat with App Creator here to create and iterate on your application using natural language
2. **Canvas UI (right)**
1. View and interact with the application you created using App Creator immediately
2. The top tool bar and overflow menu provides several tools such as showing the console (for viewing error or logging messages), fullscreen mode, and minimizing the Canvas UI

![Image](https://files.readme.io/9ee14ca10249d9100bc8a02219c4f00630e71e1c1c0b2d49d7ca4d36d6e17742-image.png)

## [Working effectively with App Creator](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#working-effectively-with-app-creator)

Think of App Creator as your personal developer who can:

- Understand natural language
- Implement features within seconds or minutes
- Provide immediate feedback
- Suggest improvements

To get the best results from App Creator, clear communication is key. Here are several examples of good requests and less effective requests:

- Good requests:
  - "Create a calculator with a modern design that can perform basic math operations"
  - "Add a dark mode toggle button in the top right corner"
  - "Make the submit button larger and match the header color"
  - “Use @FLUX-pro-1.1 instead of @FLUX-schnell”
- Less effective:
  - "Make it better" (too vague)
  - "Add all the usual calculator features" (too broad)
  - "Use JavaScript to handle clicks" (unnecessarily technical)

> 💡 Brainstorm with App Creator
>
> You can ask App Creator to help you brainstorm or evaluate various ideas! Try asking questions like:
>
> - "What features would make this app more useful?"
> - "What other ways could we display this data?"
> - "How could we make this interface more intuitive?"

## [Integration with the Poe environment](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#integration-with-the-poe-environment)

Canvas apps can interact with the Poe environment via the [Poe Embed API](https://creator.poe.com/docs/canvas-apps/poe-embed-api). They can:

- Trigger messages to Poe bots on behalf of the user
  - When doing this, the application can optionally open the Chat UI (if the user was in fullscreen Canvas view)
- Receive bot responses to those messages and use them in the application
  - These bot responses can be streamed back to the Canvas application without waiting for the entire response to be completed.

For example, a Canvas app could send a message to **@Claude-Sonnet-4.6** asking it to analyze an image, and then display that analysis within the application.

Any specific behavior - e.g. which bot to use, whether to open the chat, or whether to stream the bot response - can be specified in natural language to App Creator, which will then implement the desired behavior.

## [Troubleshooting](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#troubleshooting)

### [Describing issues](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#describing-issues)

If you notice any issues in your application, you can generally fix them by describing the issue to App Creator. To get the best results, be as clear and specific as possible regarding the issue.

- **Bad example**: "It's not working."
- **Better example**: "After clicking submit, the form clears but I don't see any response from @Claude-Sonnet-4.6 in the output area"

### [Sharing console errors](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#sharing-console-errors)

If you see any errors in the application's console (which can be opened in the Canvas overflow menu), you can copy and paste the exact error in a message to App Creator to ask it to fix the issue. For best results, describe the steps to reproduce the error, e.g. "When I click the submit button, I see this error: …".

![Image](https://files.readme.io/9d0c72134c380a5aec69b1354129b33ae7aa90b535627943ac9152f19564eae8-image.png)

### [Examining your application's messages to bots](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start\#examining-your-applications-messages-to-bots)

You can examine the messages that your application sends to bots by looking at the chat. This can help you identify any issues in e.g. prompting that you can ask App Creator to fix.

![Image](https://files.readme.io/84df372449487a9c0ad4745a91b6a045ed48873b66502e22a73f635e2d3f4468-image.png)

On this page

[What are Canvas apps?](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#what-are-canvas-apps) [Examples of Canvas apps](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#examples-of-canvas-apps) [Getting started](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#getting-started) [Canvas app development UI](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#canvas-app-development-ui) [Working effectively with App Creator](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#working-effectively-with-app-creator) [Integration with the Poe environment](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#integration-with-the-poe-environment) [Troubleshooting](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#troubleshooting) [Describing issues](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#describing-issues) [Sharing console errors](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#sharing-console-errors) [Examining your application's messages to bots](https://creator.poe.com/docs/canvas-apps/canvas-app-quick-start#examining-your-applications-messages-to-bots)