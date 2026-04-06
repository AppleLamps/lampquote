---
url: "https://creator.poe.com/docs/api-bots/bots-rest-api"
title: "Bots REST API | Poe Creator Platform"
---

# Bots REST API

Copy for LLMView as Markdown

The Bots REST API lets you manage [API Bots](https://creator.poe.com/docs/api-bots/overview) on Poe programmatically. You can create new bots, update existing ones, list all bots under your account, and delete bots you no longer need.

All endpoints require authentication using your Poe API key and return data in JSON format.

## [Authentication](https://creator.poe.com/docs/api-bots/bots-rest-api\#authentication)

All endpoints require authentication using your Poe API key in the `Authorization` header:

```
Authorization: Bearer YOUR_POE_API_KEY
```

You can get your API key from [https://poe.com/api/keys](https://poe.com/api/keys).

## [Base URL](https://creator.poe.com/docs/api-bots/bots-rest-api\#base-url)

```
https://api.poe.com
```

## [Endpoints](https://creator.poe.com/docs/api-bots/bots-rest-api\#endpoints)

### [List Bots](https://creator.poe.com/docs/api-bots/bots-rest-api\#list-bots)

Retrieve all bots under your account.

```
GET https://api.poe.com/bots
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)

**Response:**

```
{
  "bots": [\
    {\
      "handle": "MyCustomBot",\
      "description": "A custom bot powered by a chat completions endpoint",\
      "is_private": true,\
      "api_bot_settings": {\
        "model_name": "my-model",\
        "base_url": "https://api.example.com/v1",\
        "api_type": "chat_completions_api",\
        "input_modalities": ["text", "image"],\
        "output_modalities": ["text"],\
        "supported_features": ["tools"],\
        "max_input_tokens": 128000,\
        "pricing": {\
          "prompt": "0.00003",\
          "completion": "0.00006"\
        }\
      }\
    }\
  ]
}
```

**Response Fields:**

- `bots`(array): Array of bot objects, each containing:
  - `handle` (string): The bot's unique handle
  - `description` (string): The bot's description
  - `is_private` (boolean): Whether the bot is private
  - `api_bot_settings` (object, optional): API configuration (see [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings))
  - `parameter_controls` (object, optional): UI parameter controls (see [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls))

**Example:**

cURLPythonNode.js

```
curl -X GET "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY"
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY"
}

response = requests.get(
    "https://api.poe.com/bots",
    headers=headers
)

data = response.json()
for bot in data["bots"]:
    print(f"{bot['handle']}: {bot['description']} (private={bot['is_private']})")
```

```
const response = await fetch('https://api.poe.com/bots', {
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY'
  }
});

const data = await response.json();
data.bots.forEach(bot => {
  console.log(`${bot.handle}: ${bot.description} (private=${bot.is_private})`);
});
```

### [Get Bot](https://creator.poe.com/docs/api-bots/bots-rest-api\#get-bot)

Retrieve details for a specific bot under your account by handle.

```
GET https://api.poe.com/bots/{handle}
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)

**Path Parameters:**

- `handle` (string, required): The bot's unique handle

**Response:**

```
{
  "handle": "MyCustomBot",
  "description": "A custom bot powered by a chat completions endpoint",
  "is_private": true,
  "api_bot_settings": {
    "model_name": "my-model",
    "base_url": "https://api.example.com/v1",
    "api_type": "chat_completions_api",
    "input_modalities": ["text", "image"],
    "output_modalities": ["text"],
    "supported_features": ["tools"],
    "max_input_tokens": 128000,
    "pricing": {
      "prompt": "0.00003",
      "completion": "0.00006"
    }
  }
}
```

**Example:**

cURLPythonNode.js

```
curl -X GET "https://api.poe.com/bots/MyCustomBot" \
  -H "Authorization: Bearer $POE_API_KEY"
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY"
}

response = requests.get(
    "https://api.poe.com/bots/MyCustomBot",
    headers=headers
)

bot = response.json()
print(f"Handle: {bot['handle']}")
print(f"Description: {bot['description']}")
print(f"Private: {bot['is_private']}")

if bot.get("api_bot_settings"):
    settings = bot["api_bot_settings"]
    print(f"Model: {settings.get('model_name')}")
    print(f"Base URL: {settings.get('base_url')}")
```

```
const response = await fetch('https://api.poe.com/bots/MyCustomBot', {
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY'
  }
});

const bot = await response.json();
console.log(`Handle: ${bot.handle}`);
console.log(`Description: ${bot.description}`);
console.log(`Private: ${bot.is_private}`);

if (bot.api_bot_settings) {
  console.log(`Model: ${bot.api_bot_settings.model_name}`);
  console.log(`Base URL: ${bot.api_bot_settings.base_url}`);
}
```

### [Create or Update Bot](https://creator.poe.com/docs/api-bots/bots-rest-api\#create-or-update-bot)

Create a new bot or update an existing one. If a bot with the given handle already exists under your account, it will be updated with the provided fields. Otherwise, a new bot is created.

```
POST https://api.poe.com/bots
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)
- `Content-Type: application/json` (required)

**Request Body:**

```
{
  "handle": "string",
  "description": "string",
  "is_private": true,
  "api_bot_settings": {
    "model_name": "string",
    "base_url": "string",
    "api_key": "string",
    "api_type": "chat_completions_api",
    "input_modalities": ["text", "image"],
    "output_modalities": ["text"],
    "supported_features": ["tools"],
    "max_input_tokens": 128000,
    "pricing": {
      "prompt": "0.000005",
      "completion": "0.000025",
      "input_cache_reads": "0.0000025",
      "context_pricing": {
        "tiers": [\
          {\
            "min_tokens": 128000,\
            "prompt": "0.000010",\
            "completion": "0.000050",\
            "input_cache_reads": "0.0000050"\
          }\
        ]
      }
    },
    "param_definitions": [\
      {\
        "param_name": "enable_thinking",\
        "param_dest": "extra_body",\
        "default_value": true\
      }\
    ]
  },
  "parameter_controls": {
    "api_version": "2",
    "sections": []
  }
}
```

**Request Body Fields:**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `handle` | string | Yes | — | Unique handle for the bot |
| `description` | string | No | `""` | Bot description |
| `is_private` | boolean | No | `true` | Whether the bot is private |
| `api_bot_settings` | object | No | — | API configuration (see [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings)) |
| `parameter_controls` | object | No | — | UI parameter controls (see [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls)) |

**Response (Create - 201):**

```
{
  "create_bot_status": "success"
}
```

**Response (Update - 200):**

```
{
  "edit_bot_status": "success"
}
```

**Create Bot Example:**

cURLPythonNode.js

```
curl -X POST "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "handle": "MyNewBot",
    "description": "A bot powered by a custom model",
    "api_bot_settings": {
      "model_name": "my-org/my-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text", "image"],
      "output_modalities": ["text"],
      "supported_features": ["tools"],
      "max_input_tokens": 204800,
      "pricing": {
        "prompt": "0.00000006",
        "completion": "0.0000022",
        "input_cache_reads": "0.000000011"
      }
    }
  }'
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "handle": "MyNewBot",
    "description": "A bot powered by a custom model",
    "api_bot_settings": {
        "model_name": "my-org/my-model",
        "base_url": "https://api.example.com/v1",
        "api_key": "YOUR_API_KEY",
        "input_modalities": ["text", "image"],
        "output_modalities": ["text"],
        "supported_features": ["tools"],
        "max_input_tokens": 204800,
        "pricing": {
            "prompt": "0.00000006",
            "completion": "0.0000022",
            "input_cache_reads": "0.000000011"
        }
    }
}

response = requests.post(
    "https://api.poe.com/bots",
    headers=headers,
    json=payload
)

if response.status_code == 201:
    print("Bot created successfully!")
else:
    print(f"Error: {response.json()}")
```

```
const response = await fetch('https://api.poe.com/bots', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    handle: 'MyNewBot',
    description: 'A bot powered by a custom model',
    api_bot_settings: {
      model_name: 'my-org/my-model',
      base_url: 'https://api.example.com/v1',
      api_key: 'YOUR_API_KEY',
      input_modalities: ['text', 'image'],
      output_modalities: ['text'],
      supported_features: ['tools'],
      max_input_tokens: 204800,
      pricing: {
        prompt: '0.00000006',
        completion: '0.0000022',
        input_cache_reads: '0.000000011'
      }
    }
  })
});

if (response.status === 201) {
  console.log('Bot created successfully!');
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

**Update Bot Example:**

cURLPythonNode.js

```
# Update description and pricing for an existing bot
curl -X POST "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "handle": "MyExistingBot",
    "description": "Updated description",
    "api_bot_settings": {
      "pricing": {
        "prompt": "0.000002",
        "completion": "0.000004"
      }
    }
  }'
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY",
    "Content-Type": "application/json"
}

# Only include fields you want to update
payload = {
    "handle": "MyExistingBot",
    "description": "Updated description",
    "api_bot_settings": {
        "pricing": {
            "prompt": "0.000002",
            "completion": "0.000004"
        }
    }
}

response = requests.post(
    "https://api.poe.com/bots",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    print("Bot updated successfully!")
else:
    print(f"Error: {response.json()}")
```

```
// Only include fields you want to update
const response = await fetch('https://api.poe.com/bots', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    handle: 'MyExistingBot',
    description: 'Updated description',
    api_bot_settings: {
      pricing: {
        prompt: '0.000002',
        completion: '0.000004'
      }
    }
  })
});

if (response.status === 200) {
  console.log('Bot updated successfully!');
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

### [Replace Bot](https://creator.poe.com/docs/api-bots/bots-rest-api\#replace-bot)

Create a bot or replace all settings for an existing bot. If a bot with the given handle already exists under your account, its settings are replaced entirely. Otherwise, a new bot is created. Unlike POST, the handle is specified in the URL path and `api_bot_settings` is replaced entirely rather than merged.

```
PUT https://api.poe.com/bots/{handle}
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)
- `Content-Type: application/json` (required)

**Path Parameters:**

- `handle` (string, required): The bot's unique handle

**Request Body Fields:**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `description` | string | No | `""` | Bot description |
| `is_private` | boolean | No | `true` | Whether the bot is private |
| `api_bot_settings` | object | No | — | API configuration — replaces existing settings entirely (see [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings)) |
| `parameter_controls` | object | No | — | UI parameter controls (see [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls)) |

**Response (Create - 201):**

```
{
  "create_bot_status": "success"
}
```

**Response (Replace - 200):**

```
{
  "edit_bot_status": "success"
}
```

**Example:**

cURLPythonNode.js

```
curl -X PUT "https://api.poe.com/bots/MyBot" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Fully replaced bot configuration",
    "api_bot_settings": {
      "model_name": "my-org/my-new-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "max_input_tokens": 128000,
      "pricing": {
        "prompt": "0.000001",
        "completion": "0.000004"
      }
    }
  }'
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "description": "Fully replaced bot configuration",
    "api_bot_settings": {
        "model_name": "my-org/my-new-model",
        "base_url": "https://api.example.com/v1",
        "api_key": "YOUR_API_KEY",
        "input_modalities": ["text"],
        "output_modalities": ["text"],
        "max_input_tokens": 128000,
        "pricing": {
            "prompt": "0.000001",
            "completion": "0.000004"
        }
    }
}

response = requests.put(
    "https://api.poe.com/bots/MyBot",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    print("Bot replaced successfully!")
else:
    print(f"Error: {response.json()}")
```

```
const response = await fetch('https://api.poe.com/bots/MyBot', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Fully replaced bot configuration',
    api_bot_settings: {
      model_name: 'my-org/my-new-model',
      base_url: 'https://api.example.com/v1',
      api_key: 'YOUR_API_KEY',
      input_modalities: ['text'],
      output_modalities: ['text'],
      max_input_tokens: 128000,
      pricing: {
        prompt: '0.000001',
        completion: '0.000004'
      }
    }
  })
});

if (response.status === 200) {
  console.log('Bot replaced successfully!');
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

### [Update Bot](https://creator.poe.com/docs/api-bots/bots-rest-api\#update-bot)

Partially update settings for an existing bot. The bot must already exist under your account. Only the provided fields are updated; existing values are preserved for omitted fields. The handle is specified in the URL path.

```
PATCH https://api.poe.com/bots/{handle}
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)
- `Content-Type: application/json` (required)

**Path Parameters:**

- `handle` (string, required): The bot's unique handle

**Request Body Fields:**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `description` | string | No | — | Bot description |
| `is_private` | boolean | No | — | Whether the bot is private |
| `api_bot_settings` | object | No | — | API configuration — merged into existing settings (see [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings)) |
| `parameter_controls` | object | No | — | UI parameter controls (see [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls)) |

**Response (200):**

```
{
  "edit_bot_status": "success"
}
```

**Example:**

cURLPythonNode.js

```
# Update only the pricing, all other settings are preserved
curl -X PATCH "https://api.poe.com/bots/MyBot" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "api_bot_settings": {
      "pricing": {
        "prompt": "0.000002",
        "completion": "0.000008"
      }
    }
  }'
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY",
    "Content-Type": "application/json"
}

# Only include fields you want to update
payload = {
    "api_bot_settings": {
        "pricing": {
            "prompt": "0.000002",
            "completion": "0.000008"
        }
    }
}

response = requests.patch(
    "https://api.poe.com/bots/MyBot",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    print("Bot updated successfully!")
else:
    print(f"Error: {response.json()}")
```

```
// Only include fields you want to update
const response = await fetch('https://api.poe.com/bots/MyBot', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    api_bot_settings: {
      pricing: {
        prompt: '0.000002',
        completion: '0.000008'
      }
    }
  })
});

if (response.status === 200) {
  console.log('Bot updated successfully!');
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

### [Delete Bot](https://creator.poe.com/docs/api-bots/bots-rest-api\#delete-bot)

Delete a bot under your account by handle.

```
DELETE https://api.poe.com/bots/{handle}
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)

**Path Parameters:**

- `handle` (string, required): The bot's unique handle

**Response (200):**

```
{}
```

**Example:**

cURLPythonNode.js

```
curl -X DELETE "https://api.poe.com/bots/MyBot" \
  -H "Authorization: Bearer $POE_API_KEY"
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY"
}

response = requests.delete(
    "https://api.poe.com/bots/MyBot",
    headers=headers
)

if response.status_code == 200:
    print("Bot deleted successfully!")
else:
    print(f"Error: {response.json()}")
```

```
const response = await fetch('https://api.poe.com/bots/MyBot', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY'
  }
});

if (response.status === 200) {
  console.log('Bot deleted successfully!');
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

## [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api\#api-bot-settings)

The `api_bot_settings` object configures how your bot connects to your Chat Completions API (or Responses API) endpoint. Poe will call your endpoint with the configured settings.

| Field | Type | Description |
| --- | --- | --- |
| `model_name` | string | Model name passed to your endpoint (e.g. `"model-id"`, `"example-provider/model-1"`) |
| `base_url` | string | Base URL of your API endpoint (e.g. `"https://api.example.com/v1"`) |
| `api_key` | string | API key for authenticating requests to your endpoint. Encrypted at rest. |
| `api_type` | string | API format: `"chat_completions_api"` or `"responses_api"` |
| `max_input_tokens` | integer | Maximum number of input tokens allowed |
| `context_size` | integer | Total context window size in tokens |
| `input_modalities` | array | Supported input types: `"text"`, `"image"`, `"video"` (video is only supported with the Chat Completions API) |
| `output_modalities` | array | Supported output types: `"text"` |
| `supported_features` | array | Supported features: `"tools"` |
| `param_definitions` | array | Custom parameter definitions (see [Parameter Definitions](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-definitions)) |
| `pricing` | object | Token pricing configuration (see [Pricing](https://creator.poe.com/docs/api-bots/bots-rest-api#pricing)) |

All fields are optional. When updating a bot, only the fields you include will be changed; existing values are preserved for omitted fields.

### [Pricing](https://creator.poe.com/docs/api-bots/bots-rest-api\#pricing)

Poe chat messages are charged based on the token usage returned by your API response and the pricing values you configure in `api_bot_settings.pricing`.

Prices are specified as string decimal values representing the dollar cost per single token (e.g. `"0.000003"` for $0.000003 per token).

| Field | Type | Description |
| --- | --- | --- |
| `prompt` | string | Price per input token |
| `completion` | string | Price per output token |
| `input_cache_reads` | string | Price per cached input token |
| `context_pricing` | object | Multi-tier context pricing (see below) |

#### [Context Pricing](https://creator.poe.com/docs/api-bots/bots-rest-api\#context-pricing)

For models with tiered pricing based on input length, use `context_pricing` to set different rates for different context length ranges in `tiers`. Each tier specifies a token range and per-token prices. For any unset price fields within a tier, the base pricing values are used.

Each tier has the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `min_tokens` | integer | Inclusive lower bound token count for this tier |
| `max_tokens` | integer \| null | Exclusive upper bound token count (null for unlimited) |
| `prompt` | string | Price per input token for this tier |
| `completion` | string | Price per output token for this tier |

**Example with context pricing:**

```
{
  "pricing": {
    "prompt": "0.0000002",
    "completion": "0.0000005",
    "input_cache_reads": "0.00000005",
    "context_pricing": {
      "tiers": [\
        {\
          "min_tokens": 64000,\
          "max_tokens": 128000,\
          "prompt": "0.0000004",\
          "completion": "0.000001"\
        },\
        {\
          "min_tokens": 128000,\
          "prompt": "0.0000008",\
          "completion": "0.000002"\
        }\
      ]
    }
  }
}
```

### [Parameter Definitions](https://creator.poe.com/docs/api-bots/bots-rest-api\#parameter-definitions)

The `param_definitions` array defines custom parameters that users can control through the bot's UI and that are passed to your Chat Completions API endpoint.

| Field | Type | Description |
| --- | --- | --- |
| `param_name` | string | Parameter name, matches `parameter_name` in `parameter_controls` |
| `param_dest` | string | Where to place the parameter in the API request. Currently only `"extra_body"` is supported. |
| `default_value` | any | Default value when the user has not set the parameter |

When `param_dest` is `"extra_body"`, the parameter value is passed to the Chat Completions API via the `extra_body` argument:

```
# A param_definition with param_name="enable_thinking" and default_value=True
# results in the following Chat Completions API call:
client.chat.completions.create(
    ...,
    extra_body={"enable_thinking": True},
)
```

## [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api\#parameter-controls)

The `parameter_controls` object defines UI controls displayed to users when interacting with your bot. These controls allow users to adjust parameters that are passed to your API endpoint via `param_definitions`.

For full details on parameter controls, see the [Parameter Controls documentation](https://creator.poe.com/docs/server-bots/parameter-controls).

**Top-level fields:**

- `api_version` (string, required): Must be `"2"`
- `sections` (array, required): Array of UI sections

**Section fields:**

- `name` (string, optional): Section header label
- `controls` (array): Array of UI control definitions
- `collapsed_by_default` (boolean, optional): Whether the section starts collapsed

**Supported control types:**`toggle_switch`, `drop_down`, `slider`, `text_field`, `text_area`, `number_field`

**Example with parameter controls and param\_definitions:**

cURLPython

```
curl -X POST "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "handle": "MyModelWithThinking",
    "description": "A model with a configurable thinking toggle",
    "api_bot_settings": {
      "model_name": "my-org/my-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "supported_features": ["tools"],
      "max_input_tokens": 204800,
      "pricing": {
        "prompt": "0.00000006",
        "completion": "0.0000022",
        "input_cache_reads": "0.000000011"
      },
      "param_definitions": [{\
        "param_name": "enable_thinking",\
        "param_dest": "extra_body",\
        "default_value": true\
      }]
    },
    "parameter_controls": {
      "api_version": "2",
      "sections": [{\
        "name": "Advanced Settings",\
        "controls": [{\
          "control": "toggle_switch",\
          "label": "Enable Thinking",\
          "description": "This will cause the model to think about the response before giving a final answer.",\
          "parameter_name": "enable_thinking",\
          "default_value": true\
        }]\
      }]
    }
  }'
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "handle": "MyModelWithThinking",
    "description": "A model with a configurable thinking toggle",
    "api_bot_settings": {
        "model_name": "my-org/my-model",
        "base_url": "https://api.example.com/v1",
        "api_key": "YOUR_API_KEY",
        "input_modalities": ["text"],
        "output_modalities": ["text"],
        "supported_features": ["tools"],
        "max_input_tokens": 204800,
        "pricing": {
            "prompt": "0.00000006",
            "completion": "0.0000022",
            "input_cache_reads": "0.000000011"
        },
        "param_definitions": [{\
            "param_name": "enable_thinking",\
            "param_dest": "extra_body",\
            "default_value": True\
        }]
    },
    "parameter_controls": {
        "api_version": "2",
        "sections": [{\
            "name": "Advanced Settings",\
            "controls": [{\
                "control": "toggle_switch",\
                "label": "Enable Thinking",\
                "description": "This will cause the model to think about the response before giving a final answer.",\
                "parameter_name": "enable_thinking",\
                "default_value": True\
            }]\
        }]
    }
}

response = requests.post(
    "https://api.poe.com/bots",
    headers=headers,
    json=payload
)
print(response.status_code, response.json())
```

## [Error Responses](https://creator.poe.com/docs/api-bots/bots-rest-api\#error-responses)

All endpoints return standard HTTP status codes with JSON error responses.

### [400 Bad Request](https://creator.poe.com/docs/api-bots/bots-rest-api\#400-bad-request)

Returned when the request body is invalid or the operation fails validation.

```
{
  "error": {
    "message": "Description of the validation error"
  }
}
```

Common causes:

- `create_bot_status: "handle_already_taken"` — The handle is already used by another user's bot
- Invalid request body or missing required fields

### [401 Unauthorized](https://creator.poe.com/docs/api-bots/bots-rest-api\#401-unauthorized)

Returned when the API key is missing or invalid.

```
{
  "error": {
    "message": "Incorrect API key provided. You can find your API key at https://poe.com/api/keys.",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

### [403 Forbidden](https://creator.poe.com/docs/api-bots/bots-rest-api\#403-forbidden)

Returned when you try to modify or access a bot you don't own.

```
{
  "error": {
    "message": "Unauthorized to edit bot 'BotHandle'"
  }
}
```

### [404 Not Found](https://creator.poe.com/docs/api-bots/bots-rest-api\#404-not-found)

Returned when the requested bot does not exist or you don't have access to it.

```
{
  "error": {
    "message": "Bot MyBot does not exist or access denied"
  }
}
```

On this page

[Authentication](https://creator.poe.com/docs/api-bots/bots-rest-api#authentication) [Base URL](https://creator.poe.com/docs/api-bots/bots-rest-api#base-url) [Endpoints](https://creator.poe.com/docs/api-bots/bots-rest-api#endpoints) [List Bots](https://creator.poe.com/docs/api-bots/bots-rest-api#list-bots) [Get Bot](https://creator.poe.com/docs/api-bots/bots-rest-api#get-bot) [Create or Update Bot](https://creator.poe.com/docs/api-bots/bots-rest-api#create-or-update-bot) [Replace Bot](https://creator.poe.com/docs/api-bots/bots-rest-api#replace-bot) [Update Bot](https://creator.poe.com/docs/api-bots/bots-rest-api#update-bot) [Delete Bot](https://creator.poe.com/docs/api-bots/bots-rest-api#delete-bot) [API Bot Settings](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings) [Pricing](https://creator.poe.com/docs/api-bots/bots-rest-api#pricing) [Context Pricing](https://creator.poe.com/docs/api-bots/bots-rest-api#context-pricing) [Parameter Definitions](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-definitions) [Parameter Controls](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-controls) [Error Responses](https://creator.poe.com/docs/api-bots/bots-rest-api#error-responses) [400 Bad Request](https://creator.poe.com/docs/api-bots/bots-rest-api#400-bad-request) [401 Unauthorized](https://creator.poe.com/docs/api-bots/bots-rest-api#401-unauthorized) [403 Forbidden](https://creator.poe.com/docs/api-bots/bots-rest-api#403-forbidden) [404 Not Found](https://creator.poe.com/docs/api-bots/bots-rest-api#404-not-found)