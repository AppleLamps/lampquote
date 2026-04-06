---
url: "https://creator.poe.com/docs/resources/how-we-cover-your-costs"
title: "How we cover your costs | Poe Creator Platform"
---

# How we cover your costs

Copy for LLMView as Markdown

Our intent is to cover all model inference costs and any other significant per-message costs involved in operating any bot on Poe. There are two ways this can happen at present:

- If you use the [bot query API](https://creator.poe.com/docs/server-bots/accessing-other-bots-on-poe), then the cost of any model inference used by any bot you query will be automatically covered by Poe.
  - This is the easiest option and should be used whenever possible. If you are using a standard base model that is available via a bot on Poe and there is a reason this option does not work for your use case, please [get in contact with us](https://creator.poe.com/docs/resources/how-to-contact-us).
- If you want to use a model that is not currently available on Poe (and therefore not available through the bot query API), we can work with you to pay your model inference costs. Depending on how expensive they are, we may need to restrict availability to your bot to Poe subscribers only.
  - Poe’s Creator Monetization program allows you to earn payouts for every call to your bot. The payouts can be set in code for fully customizable payouts based on the inference cost, or they can be set inside of Poe’s website as flat rates per message. Visit the [Creator Monetization page](https://poe.com/creators) for more information about the program.
  - If this is a fine-tuned version of a standard open source model, this will generally involve hosting the model on an inference provider like Fireworks, Together, or Replicate, and giving us visibility into the cost per token or per item.
  - If you are training your own model from scratch and hosting your own inference, we can discuss how we can best cover inference costs.
- Please [contact us](https://creator.poe.com/docs/resources/how-to-contact-us) for more information about any of the above options.
- If there is some other especially expensive input to your bot (e.g. use of a web search API), we can likely cover that as well.