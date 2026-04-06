---
url: "https://creator.poe.com/docs/resources/usage-api"
title: "Usage API | Poe Creator Platform"
---

# Usage API

Copy for LLMView as Markdown

The Poe Usage API provides endpoints to monitor your current point balance and retrieve your usage history. These endpoints help you track your consumption and manage your API usage effectively.

**Key features:**

- Check your current point balance
- Retrieve detailed usage history with pagination
- Monitor usage across all your API calls
- Track cost per individual query

All Usage API endpoints require authentication using your Poe API key and return data in JSON format.

## [Authentication](https://creator.poe.com/docs/resources/usage-api\#authentication)

All Usage API endpoints require authentication using your Poe API key in the `Authorization` header:

```
Authorization: Bearer YOUR_POE_API_KEY
```

You can get your API key from [https://poe.com/api/keys](https://poe.com/api/keys).

## [Endpoints](https://creator.poe.com/docs/resources/usage-api\#endpoints)

### [Get Current Balance](https://creator.poe.com/docs/resources/usage-api\#get-current-balance)

Retrieve your current point balance, including both plan points and add-on points.

```
GET https://api.poe.com/usage/current_balance
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)

**Response:**

```
{
  "current_point_balance": 1500
}
```

**Response Fields:**

- `current_point_balance` (integer): Your current available points

**Example:**

cURLPythonNode.js

```
curl -X GET "https://api.poe.com/usage/current_balance" \
  -H "Authorization: Bearer YOUR_POE_API_KEY"
```

```
import requests

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY"
}

response = requests.get(
    "https://api.poe.com/usage/current_balance",
    headers=headers
)

balance_data = response.json()
print(f"Current balance: {balance_data['current_point_balance']} points")
```

```
const fetch = require('node-fetch');

const response = await fetch('https://api.poe.com/usage/current_balance', {
  headers: {
    'Authorization': 'Bearer YOUR_POE_API_KEY'
  }
});

const balanceData = await response.json();
console.log(`Current balance: ${balanceData.current_point_balance} points`);
```

### [Get Usage History](https://creator.poe.com/docs/resources/usage-api\#get-usage-history)

Retrieve your usage history with detailed information about each API call. Entries are fetched by creation time, descending, so the most recent usage histories appear first. You can fetch data up to 30 days old.

```
GET https://api.poe.com/usage/points_history
```

**Headers:**

- `Authorization: Bearer YOUR_POE_API_KEY` (required)

**Query Parameters:**

- `limit` (integer, optional): Number of entries to return. Maximum 100, default 20.
- `starting_after` (string, optional): Pagination cursor. Use the `query_id` from the last entry of a previous response to get the next page.

**Response:**

```
{
  "has_more": true,
  "length": 20,
  "data": [\
    {\
      "bot_name": "Claude-3.5-Sonnet",\
      "creation_time": 1704825600,\
      "query_id": "2Nhd9xBFbLcXEwmNj",\
      "cost_usd": "0.00075",\
      "cost_points": 339,\
      "cost_breakdown_in_points": {\
        "Input": "450 points (5290 tokens)",\
        "Cache write": "63 points (2921 tokens)",\
        "Output": "7 points (15 tokens)",\
        "Cache discount": "-181 points (2366 tokens)",\
        "Total": "339 points"\
      },\
      "usage_type": "Chat",\
      "chat_name": "Test Response"\
    },\
    {\
      "bot_name": "GPT-4",\
      "creation_time": 1704825300,\
      "query_id": "2Nhd9xBFbLcXEwmNk",\
      "cost_usd": "0.0015",\
      "cost_points": 106,\
      "cost_breakdown_in_points": {\
        "Input": "452 points (5317 tokens)",\
        "Cache write": "1 point (27 tokens)",\
        "Output": "57 points (134 tokens)",\
        "Cache discount": "-404 points (5287 tokens)",\
        "Total": "106 points"\
      },\
      "usage_type": "API",\
      "api_key_name": "My test API key"\
    }\
  ]
}
```

**Response Fields:**

- `has_more` (boolean): Whether there are more entries available for pagination
- `length` (integer): Number of entries in the current response
- `data`(array): Array of usage entries, each containing:
  - `bot_name` (string): Name of the bot or model used
  - `creation_time` (integer): Unix timestamp in microseconds when the query was created
  - `query_id` (string): Unique identifier for the query (used for pagination)
  - `cost_usd` (string): Cost in USD for this query
  - `cost_points` (integer): Number of points consumed by this query
  - `cost_breakdown_in_points` (object): Breakdown of costs by category. Keys are cost categories (e.g., "Input", "Output", "Cache write", "Cache discount", "Total") and values are strings describing the points and tokens used (e.g., "25 points (500 tokens)")
  - `usage_type` (string): Descriptor for where the points were used
  - `chat_name` (string): Chat name, if points were used on a chat. Populated if `usage_type==Chat`
  - `canvas_tab_name` (string): Canvas app name, if points were used on a canvas app. Populated if `usage_type==Canvas App`
  - `api_key_name` (string): Api key name, the name of the API key used for this query. Populated if `usage_type==API`

**Examples:**

cURLPythonNode.js

```
# Get recent usage (default 20 entries)
curl -X GET "https://api.poe.com/usage/points_history" \
  -H "Authorization: Bearer YOUR_POE_API_KEY"

# Get specific number of entries
curl -X GET "https://api.poe.com/usage/points_history?limit=50" \
  -H "Authorization: Bearer YOUR_POE_API_KEY"

# Paginate results (get next page after specific query_id)
curl -X GET "https://api.poe.com/usage/points_history?starting_after=2Nhd9xBFbLcXEwmNj&limit=20" \
  -H "Authorization: Bearer YOUR_POE_API_KEY"
```

```
import requests
from datetime import datetime

headers = {
    "Authorization": "Bearer YOUR_POE_API_KEY"
}

# Get recent usage history
response = requests.get(
    "https://api.poe.com/usage/points_history",
    headers=headers,
    params={"limit": 50}
)

usage_data = response.json()

print(f"Retrieved {usage_data['length']} entries")
print(f"Has more data: {usage_data['has_more']}")

for entry in usage_data['data']:
    # Convert microseconds to seconds for datetime
    created_time = datetime.fromtimestamp(entry['creation_time'] / 1_000_000)
    print(f"{created_time}: {entry['bot_name']} - {entry['cost_points']} points")

# Pagination example
if usage_data['has_more']:
    last_query_id = usage_data['data'][-1]['query_id']

    next_response = requests.get(
        "https://api.poe.com/usage/points_history",
        headers=headers,
        params={"starting_after": last_query_id, "limit": 50}
    )

    next_data = next_response.json()
    print(f"Next page: {next_data['length']} entries")
```

```
const fetch = require('node-fetch');

const headers = {
  'Authorization': 'Bearer YOUR_POE_API_KEY'
};

// Get usage history
const response = await fetch('https://api.poe.com/usage/points_history?limit=50', {
  headers
});

const usageData = await response.json();

console.log(`Retrieved ${usageData.length} entries`);
console.log(`Has more data: ${usageData.has_more}`);

usageData.data.forEach(entry => {
  // Convert microseconds to milliseconds for Date constructor
  const createdTime = new Date(entry.creation_time / 1000);
  console.log(`${createdTime.toISOString()}: ${entry.bot_name} - ${entry.cost_points} points`);
});

// Pagination example
if (usageData.has_more) {
  const lastQueryId = usageData.data[usageData.data.length - 1].query_id;

  const nextResponse = await fetch(
    `https://api.poe.com/usage/points_history?starting_after=${lastQueryId}&limit=50`,
    { headers }
  );

  const nextData = await nextResponse.json();
  console.log(`Next page: ${nextData.length} entries`);
}
```

## [Error Responses](https://creator.poe.com/docs/resources/usage-api\#error-responses)

All Usage API endpoints return standard HTTP status codes and JSON error responses:

### [401 Unauthorized](https://creator.poe.com/docs/resources/usage-api\#401-unauthorized)

**Missing or invalid API Key:**

```
{
  "error": {
    "message": "Incorrect API key provided. You can find your API key at https://poe.com/api/keys.",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

## [Use Cases](https://creator.poe.com/docs/resources/usage-api\#use-cases)

### [Monitoring and Alerting](https://creator.poe.com/docs/resources/usage-api\#monitoring-and-alerting)

```
import requests

def check_balance_and_alert(api_key, threshold=100):
    """Check balance and alert if below threshold"""
    headers = {"Authorization": f"Bearer {api_key}"}

    response = requests.get(
        "https://api.poe.com/usage/current_balance",
        headers=headers
    )

    balance = response.json()['current_point_balance']

    if balance < threshold:
        print(f"⚠️ Low balance alert: {balance} points remaining")
        return False

    print(f"✅ Balance OK: {balance} points")
    return True
```

### [Usage Analytics](https://creator.poe.com/docs/resources/usage-api\#usage-analytics)

```
import requests
from collections import defaultdict
from datetime import datetime, timedelta
import time

def analyze_usage_by_model(api_key, days=7):
    """Analyze usage patterns by model over the specified number of days"""
    headers = {"Authorization": f"Bearer {api_key}"}

    # Calculate cutoff timestamp for filtering (in microseconds)
    cutoff_time = (time.time() - (days * 24 * 60 * 60)) * 1_000_000

    filtered_entries = []
    starting_after = None

    # Collect usage data within the time window
    while True:
        params = {"limit": 100}
        if starting_after:
            params["starting_after"] = starting_after

        response = requests.get(
            "https://api.poe.com/usage/points_history",
            headers=headers,
            params=params
        )

        data = response.json()

        # Filter entries by creation_time (microseconds)
        for entry in data['data']:
            if entry['creation_time'] >= cutoff_time:
                filtered_entries.append(entry)
            else:
                # Since entries are in descending order, we can stop when we hit older data
                break

        # Stop if we've hit data older than our cutoff or no more data
        if not data['has_more'] or (data['data'] and data['data'][-1]['creation_time'] < cutoff_time):
            break

        starting_after = data['data'][-1]['query_id']

    # Analyze by model
    model_usage = defaultdict(lambda: {"calls": 0, "total_cost": 0})

    for entry in filtered_entries:
        model = entry['bot_name']
        model_usage[model]['calls'] += 1
        model_usage[model]['total_cost'] += entry['cost_points']

    # Print results
    print(f"Usage statistics for the last {days} days:\n")
    for model, stats in sorted(model_usage.items()):
        avg_cost = stats['total_cost'] / stats['calls'] if stats['calls'] > 0 else 0
        print(f"{model}: {stats['calls']} calls, {stats['total_cost']} total points, {avg_cost:.1f} avg per call")

    print(f"\nTotal entries analyzed: {len(filtered_entries)}")
    if filtered_entries:
        # Convert microseconds to seconds for datetime
        oldest = datetime.fromtimestamp(filtered_entries[-1]['creation_time'] / 1_000_000)
        newest = datetime.fromtimestamp(filtered_entries[0]['creation_time'] / 1_000_000)
        print(f"Date range: {oldest.strftime('%Y-%m-%d')} to {newest.strftime('%Y-%m-%d')}")
```

On this page

[Authentication](https://creator.poe.com/docs/resources/usage-api#authentication) [Endpoints](https://creator.poe.com/docs/resources/usage-api#endpoints) [Get Current Balance](https://creator.poe.com/docs/resources/usage-api#get-current-balance) [Get Usage History](https://creator.poe.com/docs/resources/usage-api#get-usage-history) [Error Responses](https://creator.poe.com/docs/resources/usage-api#error-responses) [401 Unauthorized](https://creator.poe.com/docs/resources/usage-api#401-unauthorized) [Use Cases](https://creator.poe.com/docs/resources/usage-api#use-cases) [Monitoring and Alerting](https://creator.poe.com/docs/resources/usage-api#monitoring-and-alerting) [Usage Analytics](https://creator.poe.com/docs/resources/usage-api#usage-analytics)