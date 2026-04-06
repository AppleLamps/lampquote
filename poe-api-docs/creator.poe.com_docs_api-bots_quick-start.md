---
url: "https://creator.poe.com/docs/api-bots/quick-start"
title: "Quick Start | Poe Creator Platform"
---

# Quick Start

Copy for LLMView as Markdown

Follow this checklist to create your first API Bot and verify it's working.

## [Prerequisites](https://creator.poe.com/docs/api-bots/quick-start\#prerequisites)

- A Poe account
- Your Poe API key from [poe.com/api/keys](https://poe.com/api/keys)
- A Chat Completions API compatible endpoint serving your model
- An API key for authenticating requests to your endpoint

## [Step 1: Verify API Access](https://creator.poe.com/docs/api-bots/quick-start\#step-1-verify-api-access)

Confirm your Poe API key works by listing your existing bots:

```
curl -X GET "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY"
```

You should receive a `200` response with a `bots` array (which may be empty if you haven't created any bots yet):

```
{
  "bots": []
}
```

If you get a `401` or `404` response, double-check your API key or confirm that your account has been enabled for API Bots access.

## [Step 2: Create Your Bot](https://creator.poe.com/docs/api-bots/quick-start\#step-2-create-your-bot)

Create a bot by calling `POST /bots` with your endpoint details:

```
curl -X POST "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "handle": "MyFirstApiBot",
    "description": "My first bot created via the Bots REST API",
    "api_bot_settings": {
      "model_name": "my-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "pricing": {
        "prompt": "0.000001",
        "completion": "0.000004"
      }
    }
  }'
```

A successful creation returns status `201`:

```
{
  "create_bot_status": "success"
}
```

## [Step 3: Verify Your Bot Was Created](https://creator.poe.com/docs/api-bots/quick-start\#step-3-verify-your-bot-was-created)

Fetch your bot's details to confirm it was created correctly:

```
curl -X GET "https://api.poe.com/bots/MyFirstApiBot" \
  -H "Authorization: Bearer $POE_API_KEY"
```

You should see your bot's configuration in the response:

```
{
  "handle": "MyFirstApiBot",
  "description": "My first bot created via the Bots REST API",
  "is_private": true,
  "api_bot_settings": {
    "model_name": "my-model",
    "base_url": "https://api.example.com/v1",
    "input_modalities": ["text"],
    "output_modalities": ["text"],
    "pricing": {
      "prompt": "0.000001",
      "completion": "0.000004"
    }
  }
}
```

You can also verify your bot appears in the full list:

```
curl -X GET "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY"
```

## [Step 4: Test Your Bot on Poe](https://creator.poe.com/docs/api-bots/quick-start\#step-4-test-your-bot-on-poe)

Open your bot's page on Poe at `https://poe.com/MyFirstApiBot` and send it a message. Poe will forward your message to your Chat Completions endpoint and stream back the response.

If the bot doesn't respond or returns an error, check the following:

- **base\_url** — Is the URL correct and reachable?
- **api\_key** — Is the API key valid for your endpoint?
- **model\_name** — Does the model name match what your endpoint expects?

## [Step 5: Update Your Bot (Optional)](https://creator.poe.com/docs/api-bots/quick-start\#step-5-update-your-bot-optional)

You can update specific fields without affecting the rest of your configuration using `PATCH`:

```
curl -X PATCH "https://api.poe.com/bots/MyFirstApiBot" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for my bot"
  }'
```

Or replace the entire configuration using `PUT`:

```
curl -X PUT "https://api.poe.com/bots/MyFirstApiBot" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Completely new configuration",
    "api_bot_settings": {
      "model_name": "my-newer-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "pricing": {
        "prompt": "0.000002",
        "completion": "0.000008"
      }
    }
  }'
```

After updating, verify the changes by fetching the bot again:

```
curl -X GET "https://api.poe.com/bots/MyFirstApiBot" \
  -H "Authorization: Bearer $POE_API_KEY"
```

## [Next Steps](https://creator.poe.com/docs/api-bots/quick-start\#next-steps)

- Read the full [Bots REST API reference](https://creator.poe.com/docs/api-bots/bots-rest-api) for all available endpoints and configuration options
- Add [parameter controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls) to let users adjust model settings
- Configure [long context pricing](https://creator.poe.com/docs/api-bots/bots-rest-api#long-context-pricing) if your model supports large inputs

On this page

[Prerequisites](https://creator.poe.com/docs/api-bots/quick-start#prerequisites) [Step 1: Verify API Access](https://creator.poe.com/docs/api-bots/quick-start#step-1-verify-api-access) [Step 2: Create Your Bot](https://creator.poe.com/docs/api-bots/quick-start#step-2-create-your-bot) [Step 3: Verify Your Bot Was Created](https://creator.poe.com/docs/api-bots/quick-start#step-3-verify-your-bot-was-created) [Step 4: Test Your Bot on Poe](https://creator.poe.com/docs/api-bots/quick-start#step-4-test-your-bot-on-poe) [Step 5: Update Your Bot (Optional)](https://creator.poe.com/docs/api-bots/quick-start#step-5-update-your-bot-optional) [Next Steps](https://creator.poe.com/docs/api-bots/quick-start#next-steps)