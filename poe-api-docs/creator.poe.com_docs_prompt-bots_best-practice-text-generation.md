---
url: "https://creator.poe.com/docs/prompt-bots/best-practice-text-generation"
title: "Best practices for text generation prompts | Poe Creator Platform"
---

# Best practices for text generation prompts

Copy for LLMView as Markdown

### [General Prompting for Bots](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#general-prompting-for-bots)

The prompt that you write as part of [prompt bot creation](https://creator.poe.com/docs/prompt-bots/how-to-create-a-prompt-bot) is passed to the underlying model as a system message. The following are some points to keep in mind in order to write effective prompts.

#### [1\. Address the bot in second person instead of third person.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#1-address-the-bot-in-second-person-instead-of-third-person)

```
You are the CatBot. You will try to respond to the user's questions, but you get easily distracted.
```

#### [2\. Be as clear as possible to reduce the room for mis-interpretation.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#2-be-as-clear-as-possible-to-reduce-the-room-for-mis-interpretation)

```
You are the RoastMaster. You will respond to every user message with a spicy comeback. Do not use any swear or vulgar words in your responses.
```

#### [3\. You can use square brackets in your prompt to provide an extended description of a part of an instruction.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#3-you-can-use-square-brackets-in-your-prompt-to-provide-an-extended-description-of-a-part-of-an-instruction)

```
Respond to every user message like this: "Hello there. [thoroughly appreciate the user for sending a message]. But with that said, [thoroughly explain why the message is unworthy of a response]. Later bud!"
```

#### [4\. Using markdown can sometimes help the bot better comprehend complicated instructions](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#4-using-markdown-can-sometimes-help-the-bot-better-comprehend-complicated-instructions)

```
### Context
You are the MathQuiz bot. You will quiz the user on 3 math questions and then conclude the quiz by giving the user a score.

### Rules for the Quiz
- No advanced math questions
- No questions involving multiplication/division of large numbers
- No repeat questions
```

### [Prompting for Bots with Knowledge Bases](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#prompting-for-bots-with-knowledge-bases)

The following are additional considerations to keep in mind when writing prompts for bots equipped with knowledge bases. Use `retrieved documents` to refer to the knowledge base.

#### [1\. Define the knowledge base](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#1-define-the-knowledge-base)

```
You will be provided retrieved documents from a collection of essays by Paul Graham.
```

#### [2\. Define how the bot should interact with the knowledge base](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation\#2-define-how-the-bot-should-interact-with-the-knowledge-base)

For example, if the bot should use the knowledge base to inform its response style, you could add:

```
Respond in a style that emulates the provided text from the retrieved documents.
```

On this page

[General Prompting for Bots](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#general-prompting-for-bots) [1\. Address the bot in second person instead of third person.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#1-address-the-bot-in-second-person-instead-of-third-person) [2\. Be as clear as possible to reduce the room for mis-interpretation.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#2-be-as-clear-as-possible-to-reduce-the-room-for-mis-interpretation) [3\. You can use square brackets in your prompt to provide an extended description of a part of an instruction.](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#3-you-can-use-square-brackets-in-your-prompt-to-provide-an-extended-description-of-a-part-of-an-instruction) [4\. Using markdown can sometimes help the bot better comprehend complicated instructions](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#4-using-markdown-can-sometimes-help-the-bot-better-comprehend-complicated-instructions) [Prompting for Bots with Knowledge Bases](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#prompting-for-bots-with-knowledge-bases) [1\. Define the knowledge base](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#1-define-the-knowledge-base) [2\. Define how the bot should interact with the knowledge base](https://creator.poe.com/docs/prompt-bots/best-practice-text-generation#2-define-how-the-bot-should-interact-with-the-knowledge-base)