---
url: "https://creator.poe.com/docs/script-bots/quick-start"
title: "Quick Start | Poe Creator Platform"
---

# Quick Start

Copy for LLMView as Markdown

Script bots automate AI workflows by orchestrating multiple models and custom logic together. Using Script Bot Creator, you can build script bots through natural conversation - no coding required. Script Bot Creator writes all the code, turning your ideas into working bots in minutes.

**Key capabilities:**

- Combine multiple models on Poe in multi-step workflows
- Combine text, image, video, and audio models seamlessly
- Add custom logic and processing using Python
- Build complex experiences beyond what a single model call can do

**How they differ from other bot types:**

- **Prompt bots**: A single prompt + single base model - capabilities are limited.
- **Server bots**: Powerful and flexible, but require technical expertise to deploy servers and write code.
- **Script bots**: Much more powerful than prompt bots - combine multiple models with complex logic. Infrastructure is hosted on Poe, so you don't need to worry about managing servers like you do with server bots.

## [Examples of script bots](https://creator.poe.com/docs/script-bots/quick-start\#examples-of-script-bots)

Here are some examples that showcase the range of what's possible with script bots:

**[Big-Brain-Teacher](https://poe.com/Big-Brain-Teacher)**

Turn any concept into an educational TikTok-style video with a humorous, edgy approach. Makes learning engaging and shareable. Uses Claude Sonnet 4.6 and ElevenLabs v3.

**[AIQuartet](https://poe.com/AIQuartet)**

Query multiple frontier models from OpenAI, Anthropic, Google, and xAI in parallel then get a synthesized summary of their unique perspectives. Perfect for brainstorming, ideating, or getting diverse viewpoints on complex topics.

**[Quizly](https://poe.com/Quizly)**

Transform study materials into interactive learning tools. Upload PDFs, documents, audio recordings, or paste text to instantly get flashcards, practice quizzes, and organized study notes.

**[ShopTheLook](https://poe.com/ShopTheLook)**

Upload a photo of an outfit you love and get a mood board with similar clothing items and purchase links. Great for recreating styles you see in the wild. Uses GPT-5.4, Gemini 2.5 Flash, and Nano Banana.

**[Podify](https://poe.com/Podify)**

Generate a podcast on any topic from text or documents. Perfect for creating something to listen to and learn while on-the-go - running, driving, or commuting. Uses GPT-5.4, Imagen 4 Fast, and ElevenLabs v3.

**Note:** You can also remix any of the script bots above (or other remixable script bots on Poe) to customize them for your needs - a great way to get started and learn from examples. See the [Remixing Bots](https://creator.poe.com/docs/script-bots/quick-start#remixing-bots) section below for details.

## [Getting started](https://creator.poe.com/docs/script-bots/quick-start\#getting-started)

Let's walk through the process of creating your first script bot:

1. **Initial setup**
1. Navigate to [poe.com](https://poe.com/) and click the "Create" button in the left sidebar
2. Select "Script bot" as the type

![Image](https://pfst.cf2.poecdn.net/base/image/c9d6f58f8954178fd082f88efd9734b5adfa1cd0e50cdb0da0bab86196ae2e05?w=1616&h=678)

2. **Choose your creation method**
   - (1) Generate with a bot **(Recommended - the following steps assume choosing this option)**
     - Chat with [Script Bot Creator](https://poe.com/Script-Bot-Creator) to build your bot
   - (2) Write scripts manually using Python
     - For developers who want full control
     - See the [API Reference](https://creator.poe.com/docs/script-bots/poe-python-reference) for documentation
     - You can still use Script Bot Creator to iterate on your code later
3. **Describe your idea to Script Bot Creator**
   - Script Bot Creator is an expert agent that understands your goals, writes Python code for your bot, and helps you test and refine it - all through natural conversation
   - Simply describe what you want your bot to do. For example: "Create a bot that generates a narrated storybook as a video based on the user’s prompt. Use GPT-5.4 to write the story, Nano Banana to create the images, and ElevenLabs v3 to produce the narration."
     - Note that specifying specific models to use is optional.
   - After Script Bot Creator implements the bot, you'll see a "Test" button below the code block

![Image](https://pfst.cf2.poecdn.net/base/image/2aff96b1a225b6da9ab797ff8bdf986096a08224a7b790d7a61323fcba49b5dd?w=1492&h=506)

4. **Test your bot**
   - Click the "Test" button to enter a new chat where you can test your bot
   - The bot is published as a private test bot so you can interact with it in a realistic environment
   - Send messages to test its functionality and make sure it works as expected
5. **Iterate on your bot**
   - Click "Back to chat" in the page header to return to Script Bot Creator
   - Describe what needs to be changed, issues you found, or new features you want to add
   - Script Bot Creator will update the code accordingly
   - Click "Test" again to try the updated version
   - Repeat this process until you're satisfied with your bot

![Image](https://pfst.cf2.poecdn.net/base/image/3d10b72ec1aefa72ff1a41d560d6e392e4a575d1c2fefc61a64ad9775cce5da4?w=1224&h=110)

6. **Publish your bot**
   - When you're ready to share your bot on Poe, click "Publish bot" in the test chat header
   - This creates a new public bot and you'll be prompted to:
     - Add a description, name, and bot image
     - Choose whether others can remix your bot
     - Configure other bot settings

## [Working Effectively with Script Bot Creator](https://creator.poe.com/docs/script-bots/quick-start\#working-effectively-with-script-bot-creator)

Think of Script Bot Creator as your personal developer that understands natural language. Here's how to get the best results:

### [Be clear and specific about your goal](https://creator.poe.com/docs/script-bots/quick-start\#be-clear-and-specific-about-your-goal)

✅ **Good requests:**

- "Create a bot that queries both GPT-5.4 and Claude-Sonnet-4.6 for every user question, then uses Gemini to synthesize their responses into one answer"
- "Build a bot that takes a photo and generates a presentation about the objects in the photo"
- "The 'no image found' error message should be more user-friendly and explain what image formats are supported"
- "Add a progress indicator so users know the bot is working on their request"

❌ **Less effective requests:**

- "Make it better" (too vague)
- "Fix the issue" (what issue?)
- "Add some cool features" (too broad)

### [Use Script Bot Creator as a brainstorming partner](https://creator.poe.com/docs/script-bots/quick-start\#use-script-bot-creator-as-a-brainstorming-partner)

- Ask what bots and functionalities are available
- Ask for ideas and feedback on your concept
- Tell it to ask you clarifying questions before building
- Provide images if something is hard to describe with words

### [Providing Files to Your Bot](https://creator.poe.com/docs/script-bots/quick-start\#providing-files-to-your-bot)

You can upload files (images, documents, etc.) directly to Script Bot Creator to make them part of your bot's workflow.

**Example**: Upload an image of a character, then ask Script Bot Creator to "Create a bot that generates polaroid-style pictures with this character and the user's provided photo together." The character image becomes embedded in your bot, so users only need to upload their own photo.

## [Remixing Bots](https://creator.poe.com/docs/script-bots/quick-start\#remixing-bots)

Remix allows you to start from an existing script bot and customize it for your needs. It's like starting from a template created by the community - you benefit from others' work and can adapt it to your specific use case.

### [How to Remix a Bot](https://creator.poe.com/docs/script-bots/quick-start\#how-to-remix-a-bot)

1. Find a script bot you want to customize
2. Look for the "Remix" option in the bot info card
3. Click "Remix" - this opens a chat with Script Bot Creator
4. The bot's code is automatically loaded into the conversation
5. Tell Script Bot Creator what changes you want to make
6. Script Bot Creator will modify the code based on your instructions
7. Test and publish your customized version as a new bot

![Image](https://pfst.cf2.poecdn.net/base/image/cc27d9ae5b7b8934f58c63cae9e9ed4a28cca02c39f5e26c892cd40b41b15848?w=1302&h=578)

**Important notes:**

- Your remixed bot is a separate, new bot (it doesn't modify the original)
- Creators can choose whether their bots are remixable when publishing

## [Tips and Best Practices](https://creator.poe.com/docs/script-bots/quick-start\#tips-and-best-practices)

- **Start simple and add complexity incrementally**: Get the core functionality working first, then enhance
- **Test frequently during development**: Catch issues early by testing after each change
- **Be explicit about what you want the bot to show users**: Think about the user experience - what should they see and when?
- **Chat Branching**: If you want to try a different approach or undo recent changes without losing your conversation history, use the "Branch" feature to start over from a specific point in the conversation. This feature is accessible from the message overflow menu.

### [Getting Help](https://creator.poe.com/docs/script-bots/quick-start\#getting-help)

- Join the [Poe Discord community](https://discord.gg/WPEpVNRqwj) to connect with other creators, share your bots, and get feedback
- Request new features via Discord or by tagging [@poe\_platform](https://x.com/poe_platform) on X

## [Advanced Features](https://creator.poe.com/docs/script-bots/quick-start\#advanced-features)

### [Manual Code Editing with Code-Editor](https://creator.poe.com/docs/script-bots/quick-start\#manual-code-editing-with-code-editor)

For users comfortable with code who want more direct control:

- Access Code-Editor directly at [poe.com/Code-Editor](https://poe.com/Code-Editor)
- Or click "Edit Code" on any Poe Python code block in your conversation
- Click "Save" to save code back to the chat for Script Bot Creator to iterate on
- Click "Run" to execute code directly (for scripts without user input)

### [Understanding Your Bot's Code](https://creator.poe.com/docs/script-bots/quick-start\#understanding-your-bots-code)

Script bots use Python with a special `poe` library that provides access to Poe's ecosystem:

- The code executes in a secure sandbox (see [Limitations](https://creator.poe.com/docs/script-bots/limitations) for details)
- Can call any bot on Poe
- Can use Python standard library and many popular third-party packages
- See the [Poe Python Reference](https://creator.poe.com/docs/script-bots/poe-python-reference) for complete documentation

* * *

Ready to build something amazing? [Start creating your first script bot now!](https://poe.com/Script-Bot-Creator)

On this page

[Examples of script bots](https://creator.poe.com/docs/script-bots/quick-start#examples-of-script-bots) [Getting started](https://creator.poe.com/docs/script-bots/quick-start#getting-started) [Working Effectively with Script Bot Creator](https://creator.poe.com/docs/script-bots/quick-start#working-effectively-with-script-bot-creator) [Be clear and specific about your goal](https://creator.poe.com/docs/script-bots/quick-start#be-clear-and-specific-about-your-goal) [Use Script Bot Creator as a brainstorming partner](https://creator.poe.com/docs/script-bots/quick-start#use-script-bot-creator-as-a-brainstorming-partner) [Providing Files to Your Bot](https://creator.poe.com/docs/script-bots/quick-start#providing-files-to-your-bot) [Remixing Bots](https://creator.poe.com/docs/script-bots/quick-start#remixing-bots) [How to Remix a Bot](https://creator.poe.com/docs/script-bots/quick-start#how-to-remix-a-bot) [Tips and Best Practices](https://creator.poe.com/docs/script-bots/quick-start#tips-and-best-practices) [Getting Help](https://creator.poe.com/docs/script-bots/quick-start#getting-help) [Advanced Features](https://creator.poe.com/docs/script-bots/quick-start#advanced-features) [Manual Code Editing with Code-Editor](https://creator.poe.com/docs/script-bots/quick-start#manual-code-editing-with-code-editor) [Understanding Your Bot's Code](https://creator.poe.com/docs/script-bots/quick-start#understanding-your-bots-code)