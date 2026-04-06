---
url: "https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation"
title: "Bot Monetization API | Poe Creator Platform"
---

# Bot Monetization API

Copy for LLMView as Markdown

## [Overview](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#overview)

The Poe Bot Monetization API allows bot creators to implement variable pricing for their bots. Rather than charging a fixed price per message from within the Poe website, you can dynamically price your bot's responses based on factors like input length, output length, or computational complexity.

The API provides two main functions:

1. **Authorize**: Reserve potential costs before providing the service
2. **Capture**: Actually charge the user after providing the service

## [Key Concepts](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#key-concepts)

### [Cost Items](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#cost-items)

Costs are specified using `CostItem` objects that contain:

- `amount_usd_milli_cents: int`: The cost in thousandths of a US cent
- `description: Optional[str]`: Optional description of what the cost is for. This should be clear enough to be user-facing.

Note: Amounts are in integer format to avoid floating point precision issues.

### [Rate Cards](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#rate-cards)

You can define a rate card in your bot settings to explain your pricing structure to users. The rate card supports markdown formatting and special tags to display prices. By using the tag `[usd_milli_cents=X]` , X will be converted into the applicable compute points value.

### [Cost Label](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#cost-label)

You can define a cost label in your bot settings to provide a concise description of your bot's cost. The cost label should be a short string that clearly communicates how users are charged. By using the tag `[usd_milli_cents=X]` , X will be converted into the applicable compute points value.

## [Implementation Steps](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#implementation-steps)

### [1\. Prerequisites](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#1-prerequisites)

- Be enrolled in Poe revenue sharing
- Use the latest version of `fastapi_poe`

### [2\. Implement Cost Authorization](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#2-implement-cost-authorization)

Before processing expensive operations, authorize the potential cost:

```
  await self.authorize_cost(
      request,
      fp.CostItem(
          amount_usd_milli_cents=estimated_cost,
          description="Bot message"
      )
  )
```

(See [Examples](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#examples) for more examples.)

### [3\. Implement Cost Capture](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#3-implement-cost-capture)

After providing the service, capture the actual cost:

```
await self.capture_cost(
    request,
    fp.CostItem(
        amount_usd_milli_cents=actual_cost,
        description="Bot message"
    )
)
```

(See [Examples](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#examples) for more examples.)

### [4\. Define Your Rate Card and Cost Label](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#4-define-your-rate-card-and-cost-label)

Override the `get_settings` method to specify your pricing structure:

```
async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
    rate_card = (
        "Cost overview: \n\n"
        "| Type | Rate |\n"
        "|------|------|\n"
        "| Input (text) | [usd_milli_cents=10] points / 1k tokens |\n"
        "| Input (image) | [usd_milli_cents=10] points / 1k pixels |\n"
    )
    cost_label = "[usd_milli_cents=30]+"
    return fp.SettingsResponse(rate_card=rate_card, cost_label=cost_label)
```

## [Examples](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#examples)

### [Basic Implementation](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#basic-implementation)

```
async def get_response(self, request: fp.QueryRequest) -> AsyncIterable[fp.PartialResponse]:
    # Calculate estimated cost (dummy)
    input_tokens = await self._get_num_tokens(request.query)
    estimated_cost = input_tokens * COST_PER_TOKEN

    # Authorize estimated cost
    await self.authorize_cost(request,
        fp.CostItem(
            amount_usd_milli_cents=estimated_cost,
            description="Bot message"
        )
    )

    # Process request (dummy)
    response = await self._process_query(request.query)

    # Capture actual cost
    actual_cost = len(response) * COST_PER_TOKEN
    await self.capture_cost(request,
        fp.CostItem(
            amount_usd_milli_cents=actual_cost,
            description="Bot message"
        )
    )

    yield fp.PartialResponse(text=response)
```

### [Multiple Cost Items](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#multiple-cost-items)

```
costs = [\
    fp.CostItem(amount_usd_milli_cents=1000, description="Base message cost"),\
    fp.CostItem(amount_usd_milli_cents=5000, description="Additional message cost")\
]
await self.authorize_cost(request, costs)
```

## [Best Practices](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#best-practices)

1. **Authorize Early and Accurately**: Try to authorize costs at the beginning of processing to avoid wasting resources. Make your cost estimates as accurate as possible to avoid over-authorizing (in which case some users may not have enough points) or under-authorizing (in which case you aren’t always paid everything you ultimately need).
2. **Clear Documentation**: Use the rate card to clearly explain your pricing structure to users.
3. **Cost Descriptions**: Provide clear descriptions for each cost item to help users understand charges and how they connect to your pricing structure.
4. **Error Handling**: Always handle InsufficientFundError gracefully to provide a good user experience.
5. **Minimize total Authorizations and Captures**: Use as few calls to authorize and capture as you need for the bot to work well. Each additional one is another case to handle for you, and another potentially high-friction experience for your bot’s user.

## [Limitations](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation\#limitations)

- This Monetization API is currently in beta. Please send feedback to [developers@poe.com](mailto:Developers@poe.com)
- Monetary amounts are specified in milli-cents (thousandths of a cent)
- Bots can only authorize and capture their own costs, not costs for dependency bots called through the Poe Bot API

On this page

[Overview](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#overview) [Key Concepts](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#key-concepts) [Cost Items](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#cost-items) [Rate Cards](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#rate-cards) [Cost Label](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#cost-label) [Implementation Steps](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#implementation-steps) [1\. Prerequisites](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#1-prerequisites) [2\. Implement Cost Authorization](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#2-implement-cost-authorization) [3\. Implement Cost Capture](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#3-implement-cost-capture) [4\. Define Your Rate Card and Cost Label](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#4-define-your-rate-card-and-cost-label) [Examples](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#examples) [Basic Implementation](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#basic-implementation) [Multiple Cost Items](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#multiple-cost-items) [Best Practices](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#best-practices) [Limitations](https://creator.poe.com/docs/server-bots/poe-bot-monetization-api-documentation#limitations)