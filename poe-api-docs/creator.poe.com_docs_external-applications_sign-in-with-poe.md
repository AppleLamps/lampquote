---
url: "https://creator.poe.com/docs/external-applications/sign-in-with-poe"
title: "Sign in with Poe (OAuth) | Poe Creator Platform"
---

# Sign in with Poe (OAuth)

Copy for LLMView as Markdown

Programmatically obtain an API key on behalf of a user to query Poe bots and models on their behalf.

The flow uses the OAuth 2.0 Authorization Code Grant with mandatory
PKCE for security.

## [How it works](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#how-it-works)

1. Your app redirects the user to Poe's authorization page
2. The user reviews the connection and clicks **"Connect"**
3. Poe redirects back to your app with an authorization code
4. Your app exchanges the code for an API key

## [Step 1: Register your client](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-1-register-your-client)

Go to [poe.com/api/clients](https://poe.com/api/clients) and click **"Create client"**.

| Field | Description |
| --- | --- |
| **Client Name** | Display name shown to users on the consent screen |
| **Redirect URIs** | One or more callback URLs where Poe sends the authorization code after the user approves. `localhost` URIs do not need to be registered and work automatically for local development. |

After creation, copy your **"Client ID"** — you will need this in a later step. You can edit or delete your client from this page at any time.

## [Step 2: Generate PKCE parameters](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-2-generate-pkce-parameters)

[PKCE (Proof Key for Code Exchange)](https://oauth.net/2/pkce/) prevents
authorization code interception attacks. Instead of a client secret, your app creates a
one-time **code verifier** (a random string) and sends its SHA-256 hash — the
**code challenge** — in the authorization request. When you exchange the code for an API key,
you send the original verifier so Poe can confirm the same app that started the flow is
finishing it.

BrowserNode.jsPython

```
const bytes = new Uint8Array(32);
crypto.getRandomValues(bytes);
const codeVerifier = btoa(String.fromCharCode(...bytes))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

// Store codeVerifier — you'll need it in Step 5
```

```
import crypto from "node:crypto";

const codeVerifier = crypto.randomBytes(32).toString("base64url");

const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64url");

// Store codeVerifier — you'll need it in Step 5
```

```
import hashlib
import base64
import secrets

code_verifier = secrets.token_urlsafe(32)

digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
code_challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")

# Store code_verifier — you'll need it in Step 5
```

## [Step 3: Send your user to Poe](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-3-send-your-user-to-poe)

Build the authorization URL (`https://poe.com/oauth/authorize`) and redirect the user to it:

BrowserNode.jsPython

```
const params = new URLSearchParams({
  client_id: "<CLIENT_ID>",
  redirect_uri: "https://yourapp.com/callback",
  response_type: "code",
  scope: "apikey:create",
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
});

window.location.href = `https://poe.com/oauth/authorize?${params}`;
```

```
// Express
app.get("/auth/poe", (req, res) => {
  const params = new URLSearchParams({
    client_id: "<CLIENT_ID>",
    redirect_uri: "https://yourapp.com/callback",
    response_type: "code",
    scope: "apikey:create",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.redirect(`https://poe.com/oauth/authorize?${params}`);
});
```

```
# FastAPI
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

@app.get("/auth/poe")
def login():
    params = urlencode({
        "client_id": "<CLIENT_ID>",
        "redirect_uri": "https://yourapp.com/callback",
        "response_type": "code",
        "scope": "apikey:create",
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    })
    return RedirectResponse(f"https://poe.com/oauth/authorize?{params}")
```

| Parameter | Required | Description |
| --- | --- | --- |
| `client_id` | Yes | Your app's Client ID |
| `redirect_uri` | Yes | Must exactly match one of your registered redirect URIs |
| `response_type` | Yes | Must be `code` |
| `scope` | Yes | Must be `apikey:create` |
| `code_challenge` | Yes | Base64url-encoded SHA-256 hash of the code verifier |
| `code_challenge_method` | Yes | Must be `S256` |
| `state` | No | Opaque value returned unchanged in the redirect. Can be used to prevent CSRF |

## [Step 4: User approves the connection](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-4-user-approves-the-connection)

The user sees a consent screen and can optionally choose an API key expiration.

On success, Poe redirects to your `redirect_uri` with a `code` parameter. Extract it in your callback:

BrowserNode.jsPython

```
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const error = params.get("error");
const errorDescription = params.get("error_description");

if (error) {
  // Handle error (see table below)
}
```

```
// Express
app.get("/callback", (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const errorDescription = req.query.error_description;

  if (error) {
    // Handle error (see table below)
  }
});
```

```
# FastAPI
@app.get("/callback")
def callback(code: str = None, error: str = None, error_description: str = None):
    if error:
        # Handle error (see table below)
        pass
```

On error, Poe redirects with `error` and `error_description`:

| `error` | Cause |
| --- | --- |
| `access_denied` | The user clicked **"Deny"** |
| `invalid_request` | Missing or malformed required parameters |
| `unsupported_response_type` | `response_type` is not `code` |
| `invalid_scope` | Scope is missing or not supported |

## [Step 5: Exchange code for API key](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-5-exchange-code-for-api-key)

The authorization code is short-lived and can only be used once. Exchange it for an API key at `https://api.poe.com/token`.

BrowserNode.jsPythoncURL

```
const response = await fetch("https://api.poe.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    client_id: "<CLIENT_ID>",
    code,
    redirect_uri: "https://yourapp.com/callback",
    code_verifier: codeVerifier,
  }),
});

const { api_key, api_key_expires_in } = await response.json();
```

```
const response = await fetch("https://api.poe.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    client_id: "<CLIENT_ID>",
    code,
    redirect_uri: "https://yourapp.com/callback",
    code_verifier: codeVerifier,
  }),
});

const { api_key, api_key_expires_in } = await response.json();
```

```
import requests

response = requests.post(
    "https://api.poe.com/token",
    data={
        "grant_type": "authorization_code",
        "client_id": "<CLIENT_ID>",
        "code": code,
        "redirect_uri": "https://yourapp.com/callback",
        "code_verifier": code_verifier,
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"},
)

data = response.json()
api_key = data["api_key"]
expires_in = data["api_key_expires_in"]  # seconds, or None if no expiry
```

```
curl -X POST https://api.poe.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=<CLIENT_ID>" \
  -d "code=<CODE>" \
  -d "redirect_uri=https://yourapp.com/callback" \
  -d "code_verifier=<CODE_VERIFIER>"
```

| Field | Type | Description |
| --- | --- | --- |
| `api_key` | `string` | The API key to use for Poe API requests |
| `api_key_expires_in` | number or null | Seconds until the key expires, or null if it does not expire |

On error, the response includes `error` and `error_description`:

| `error` | Cause |
| --- | --- |
| `invalid_request` | Missing parameter, invalid `Content-Type`, or too many requests |
| `invalid_grant` | Code expired or invalid, PKCE verification failed, or parameter mismatch |
| `unsupported_grant_type` | `grant_type` is not `authorization_code` |
| `server_error` | Internal error — safe to retry |

Users can view the key issued through your app at [poe.com/api/keys](https://poe.com/api/keys).

## [Step 6: Use the API key](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#step-6-use-the-api-key)

Use the API key to make requests to the Poe API on behalf of the user. See the [OpenAI Compatible API](https://creator.poe.com/docs/external-applications/openai-compatible-api) for usage examples.

## [Support](https://creator.poe.com/docs/external-applications/sign-in-with-poe\#support)

Feel free to [reach out to support](mailto:developers@poe.com) if you have questions or run into
unexpected behavior.

On this page

[How it works](https://creator.poe.com/docs/external-applications/sign-in-with-poe#how-it-works) [Step 1: Register your client](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-1-register-your-client) [Step 2: Generate PKCE parameters](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-2-generate-pkce-parameters) [Step 3: Send your user to Poe](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-3-send-your-user-to-poe) [Step 4: User approves the connection](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-4-user-approves-the-connection) [Step 5: Exchange code for API key](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-5-exchange-code-for-api-key) [Step 6: Use the API key](https://creator.poe.com/docs/external-applications/sign-in-with-poe#step-6-use-the-api-key) [Support](https://creator.poe.com/docs/external-applications/sign-in-with-poe#support)