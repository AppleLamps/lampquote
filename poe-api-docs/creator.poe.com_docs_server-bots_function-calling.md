---
url: "https://creator.poe.com/docs/server-bots/function-calling"
title: "Function (Tool) Calling | Poe Creator Platform"
---

# Function (Tool) Calling

Copy for LLMView as Markdown

The Poe API allows you to use **function calling** (also known as **tool calling**) with OpenAI, Anthropic, and Google models available on the Poe platform.

## [The function calling flow](https://creator.poe.com/docs/server-bots/function-calling\#the-function-calling-flow)

The function calling flow consists of the following steps, as listed in [OpenAI's documentation](https://platform.openai.com/docs/guides/function-calling):

1. Make a request to the model with tools it could call
2. Receive a tool call from the model
3. Execute code on the application side with input from the tool call
4. Make a second request to the model with the tool output
5. Receive a final response from the model (or more tool calls)

![Function calling diagram showing the 5 steps](https://creator.poe.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffunction-calling-diagram-steps.0g~f8o0x2squp.png&w=3840&q=75)

Let's walk through these steps with real code examples.

## [Passing tool definitions to the LLM](https://creator.poe.com/docs/server-bots/function-calling\#passing-tool-definitions-to-the-llm)

Passing tool definitions to the LLM is part of [steps 1 and 4 in the function calling flow](https://creator.poe.com/docs/server-bots/function-calling#the-function-calling-flow). When your server bot calls an LLM with `fp.stream_request()`, it can pass tool definitions via the `tools` parameter to let the LLM know that certain tools are available for answering the query. Each tool definition should correspond to a Python function that the server bot can call. LLMs cannot directly call these functions, but they can respond with structured data detailing which functions to call and with which arguments.

```
import fastapi_poe as fp
import requests

# The Python function that the server bot will call
def get_weather(latitude: float, longitude: float) -> float:
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}"
        "&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,"
        "relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data['current']['temperature_2m']

# The tool definitions to send to the LLM
tools_dicts = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_weather",\
            "description": "Get current temperature for provided coordinates in Celsius.",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "latitude": {"type": "number"},\
                    "longitude": {"type": "number"}\
                },\
                "required": ["latitude", "longitude"],\
                "additionalProperties": False\
            },\
            "strict": True\
        }\
    },\
]
tool_definitions = [fp.ToolDefinition(**tools_dict) for tools_dict in tools_dicts]

class FunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request,
            TOOL_CALL_BOT,
            request.access_key,
            tools=tool_definitions,
        ):
            # Handle the tool calls (or regular responses) from the LLM
            ...
```

## [Handling tool calls and regular responses from LLMs](https://creator.poe.com/docs/server-bots/function-calling\#handling-tool-calls-and-regular-responses-from-llms)

Receiving tool calls and receiving regular responses from the LLM are [steps 2 and 5 in the function calling flow](https://creator.poe.com/docs/server-bots/function-calling#the-function-calling-flow). In practice, however, these steps must be handled together. When your server bot calls an LLM using `fp.stream_request()` with the `tools` parameter set, the LLM may return _either regular responses or tool calls_. Returning regular responses indicates that the LLM was able to answer the query without using any of the tools given in the `tools` argument. Returning tool calls indicates that the LLM needs to know tool execution results (in the above example, the temperature for a given latitude-longitude pair) in order to best answer the query. As mentioned earlier, the LLM cannot directly execute the tools, so your server bot must do so and pass the results back to the LLM. This back-and-forth may happen multiple times depending on the complexity of the query and the tools provided.

When an LLM returns tool calls, it does so by sending tool call deltas in the `tool_calls` field of the `PartialResponse` objects returned by `fp.stream_request()`. Each delta has an `index` that indicates to which tool call it belongs, so the index can be used to aggregate deltas into fully actionable tool calls.

```
class FunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        tool_calls: dict[int, fp.ToolCallDefinition] = {}
        async for msg in fp.stream_request(
            request,
            TOOL_CALL_BOT,
            request.access_key,
            tools=tool_definitions,
        ):
            # Handle tool calls
            if msg.tool_calls:
                for tool_call in msg.tool_calls:
                    if tool_call.index not in tool_calls:
                        tool_calls[tool_call.index] = tool_call
                    else:
                        tool_calls[\
                            tool_call.index\
                        ].function.arguments += tool_call.function.arguments

            # Handle regular responses (in this case, stream them to the user)
            else:
                yield msg

        # Execute the tool calls
        ...
```

## [Executing the tool calls](https://creator.poe.com/docs/server-bots/function-calling\#executing-the-tool-calls)

After the LLM returns tool calls, your server bot can execute the tools to help the LLM determine a final response to the query. Executing the tools simply involves calling the corresponding functions with the arguments suggested by the LLM.

```
tool_executables_map = {
    "get_weather": get_weather,
}

def get_tool_call_result(tool_call: fp.ToolCallDefinition) -> fp.ToolResultDefinition:
    """Execute the tool and return the result wrapped in a ToolResultDefinition"""
    tool_name = tool_call.function.name
    tool_args = json.loads(tool_call.function.arguments)
    tool_function = tool_executables_map[tool_name]

    result = tool_function(**tool_args)
    return fp.ToolResultDefinition(
        role="tool",
        name=tool_name,
        tool_call_id=tool_call.id,
        content=str(result),
    )

tool_results: list[fp.ToolResultDefinition] = [\
    get_tool_call_result(tool_call)\
    for tool_call in tool_calls.values()\
]
```

## [Passing tool calls and results back to the LLM](https://creator.poe.com/docs/server-bots/function-calling\#passing-tool-calls-and-results-back-to-the-llm)

After your server bot executes the suggested tool calls, it can call the LLM again to get a final response (or more tool calls if appropriate). Before calling the LLM again, your server bot should add both the tool calls and the tool execution results to the input context. You can do this by appending `ProtocolMessage` objects to `request.query` before passing `request` to `stream_request()` for subsequent LLM calls. More specifically:

- Serialize the lists of `ToolCallDefinition` and `ToolResultDefinition` into JSON strings and put them into their respective `ProtocolMessage`'s `content` field.
- Use `ProtocolMessage.role="bot"` and `ProtocolMessage.message_type="function_call"` to indicate a tool call message.
- Use `ProtocolMessage.role="tool"` to indicate a tool execution result message.

```
tool_calls: list[fp.ToolCallDefinition] = ...  # tool calls suggested by the LLM
tool_results: list[fp.ToolResultDefinition] = ...  # tool execution results

tool_call_message = fp.ProtocolMessage(
    role="bot",
    message_type="function_call",
    content=json.dumps(
        [tool_call.model_dump() for tool_call in tool_calls]
    ),
)
request.query.append(tool_call_message)

tool_result_message = fp.ProtocolMessage(
    role="tool",
    content=json.dumps(
        [tool_result.model_dump() for tool_result in tool_results]
    ),
)
request.query.append(tool_result_message)

# Subsequent request to the LLM to get final response or more tool calls
async for msg in fp.stream_request(
    request,
    TOOL_CALL_BOT,
    request.access_key,
    tools=tool_definitions,
):
    # Handle the tool calls (or regular responses) from the LLM
    ...
```

## [Remembering previous tool calls in the chat (optional)](https://creator.poe.com/docs/server-bots/function-calling\#remembering-previous-tool-calls-in-the-chat-optional)

Tool call details are not preserved in the chat context automatically. To prevent your server bot from hallucinating about its past responses, you can save tool call details to the chat using a `DataResponse`:

```
tool_messages: list[fp.ProtocolMessage] = []

# Code for making bot calls and executing tools
...
tool_messages.append(tool_call_message)
tool_messages.append(tool_result_message)
...

# Store the tool messages for later calls to this server bot
yield fp.DataResponse(
    metadata=json.dumps([tool_message.model_dump() for tool_message in tool_messages])
)
```

You can then load them in subsequent calls using the `metadata` field on the request's `ProtocolMessage` objects:

```
# Load the tool messages from the previous calls to this server bot
chat_context_with_metadata_expanded: list[fp.ProtocolMessage] = []
for msg in request.query:
    if msg.metadata is not None:
        metadata_message_dicts = json.loads(msg.metadata)
        chat_context_with_metadata_expanded.extend([\
            fp.ProtocolMessage.model_validate(metadata_message_dict)\
            for metadata_message_dict in metadata_message_dicts\
        ])
    chat_context_with_metadata_expanded.append(msg.model_copy(update={"metadata": None}))
request.query = chat_context_with_metadata_expanded

# Code for making bot calls and executing tools
...
```

Your server bot is now aware of previous tool calls, and is less likely to hallucinate about how it answered previous user queries.

## [Full code example](https://creator.poe.com/docs/server-bots/function-calling\#full-code-example)

```
import json
from typing import AsyncIterable

import fastapi_poe as fp
import requests
from modal import App, Image, asgi_app

TOOL_CALL_BOT = "GPT-5.4"
MAX_BOT_CALLS = 10

def get_weather(latitude: float, longitude: float) -> float:
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}"
        "&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,"
        "relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data['current']['temperature_2m']

tools_dicts = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_weather",\
            "description": "Get current temperature for provided coordinates in Celsius.",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "latitude": {"type": "number"},\
                    "longitude": {"type": "number"}\
                },\
                "required": ["latitude", "longitude"],\
                "additionalProperties": False\
            },\
            "strict": True\
        }\
    },\
]
tool_executables_map = {
    "get_weather": get_weather,
}
tool_definitions = [fp.ToolDefinition(**tools_dict) for tools_dict in tools_dicts]

def get_tool_call_result(tool_call: fp.ToolCallDefinition) -> fp.ToolResultDefinition:
    """Execute the tool and return the result wrapped in a ToolResultDefinition"""
    tool_name = tool_call.function.name
    tool_args = json.loads(tool_call.function.arguments)
    tool_function = tool_executables_map[tool_name]

    result = tool_function(**tool_args)
    return fp.ToolResultDefinition(
        role="tool",
        name=tool_name,
        tool_call_id=tool_call.id,
        content=str(result),
    )

class FunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        # Load the tool messages from the previous calls to this server bot
        chat_context_with_metadata_expanded: list[fp.ProtocolMessage] = []
        for msg in request.query:
            if msg.metadata is not None:
                metadata_message_dicts = json.loads(msg.metadata)
                chat_context_with_metadata_expanded.extend([\
                    fp.ProtocolMessage.model_validate(metadata_message_dict)\
                    for metadata_message_dict in metadata_message_dicts\
                ])
            chat_context_with_metadata_expanded.append(msg.model_copy(update={"metadata": None}))
        request.query = chat_context_with_metadata_expanded
        tool_messages: list[fp.ProtocolMessage] = []

        continue_tool_loop = True
        call_count = 0
        while continue_tool_loop:
            continue_tool_loop = False
            tool_calls: dict[int, fp.ToolCallDefinition] = {}
            call_count += 1

            # Make sure to produce a final response if no more bot calls are allowed.
            force_final_response = call_count >= MAX_BOT_CALLS

            # 1. [First iteration] Make a request to the model with tools it could call
            # 4. [Subsequent iterations] Make another request to the model with the tool output
            async for msg in fp.stream_request(
                request,
                TOOL_CALL_BOT,
                request.access_key,
                tools=None if force_final_response else tool_definitions,
            ):
                # 2. [First iteration] Receive a tool call from the model
                # 5. [Subsequent iterations] Receive a final response from the model (or more tool calls)
                if msg.tool_calls:
                    for tool_call in msg.tool_calls:
                        if tool_call.index not in tool_calls:
                            tool_calls[tool_call.index] = tool_call
                        else:
                            tool_calls[\
                                tool_call.index\
                            ].function.arguments += tool_call.function.arguments
                    continue_tool_loop = True

                else:
                    yield msg

            tool_results: list[fp.ToolResultDefinition] = []
            for tool_call in tool_calls.values():
                # 3. Execute code on the application side with input from the tool call
                tool_result = get_tool_call_result(tool_call)
                tool_results.append(tool_result)

            # Add the tool calls and results to the context for subsequent requests to the model
            if tool_calls and tool_results:
                tool_call_message = fp.ProtocolMessage(
                    role="bot",
                    message_type="function_call",
                    content=json.dumps(
                        [tool_call.model_dump() for tool_call in tool_calls.values()]
                    ),
                )
                request.query.append(tool_call_message)
                tool_messages.append(tool_call_message)

                tool_result_message = fp.ProtocolMessage(
                    role="tool",
                    content=json.dumps(
                        [tool_result.model_dump() for tool_result in tool_results]
                    ),
                )
                request.query.append(tool_result_message)
                tool_messages.append(tool_result_message)

        # Store the tool messages for later calls to this server bot
        yield fp.DataResponse(
            metadata=json.dumps([tool_message.model_dump() for tool_message in tool_messages])
        )


    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        return fp.SettingsResponse(
            server_bot_dependencies={TOOL_CALL_BOT: MAX_BOT_CALLS},
        )
```

![](https://pfst.cf2.poecdn.net/base/image/124a3eb77e3dc8f4d8bf3df4476952c00cad98a77e568f1f4091e7b4c4c3ed48?w=736&h=430&pmaid=441461299)

See this example in [the quickstart repository](https://github.com/poe-platform/server-bot-quick-start/blob/main/function_calling_loop_bot.py) with additional setup code required to host this bot on [Modal](https://modal.com/).

## [Running functions automatically](https://creator.poe.com/docs/server-bots/function-calling\#running-functions-automatically)

You can also pass an executables list corresponding to your function definitions list to automatically run the suggested tools up to once each.

```
tools_executables = [get_weather]

class FunctionCallingBot(fp.PoeBot):
    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        async for msg in fp.stream_request(
            request,
            TOOL_CALL_BOT,
            request.access_key,
            tools=tool_definitions,
            # If tool_executables is set, the functions will run automatically.
            tool_executables=tools_executables,
        ):
            yield msg
```

This simplifies the logic so that you do not need to handle the tool calls returned by the model. The full code for this approach is also available in [the quickstart repository](https://github.com/poe-platform/server-bot-quick-start/blob/main/function_calling_bot.py).

On this page

[The function calling flow](https://creator.poe.com/docs/server-bots/function-calling#the-function-calling-flow) [Passing tool definitions to the LLM](https://creator.poe.com/docs/server-bots/function-calling#passing-tool-definitions-to-the-llm) [Handling tool calls and regular responses from LLMs](https://creator.poe.com/docs/server-bots/function-calling#handling-tool-calls-and-regular-responses-from-llms) [Executing the tool calls](https://creator.poe.com/docs/server-bots/function-calling#executing-the-tool-calls) [Passing tool calls and results back to the LLM](https://creator.poe.com/docs/server-bots/function-calling#passing-tool-calls-and-results-back-to-the-llm) [Remembering previous tool calls in the chat (optional)](https://creator.poe.com/docs/server-bots/function-calling#remembering-previous-tool-calls-in-the-chat-optional) [Full code example](https://creator.poe.com/docs/server-bots/function-calling#full-code-example) [Running functions automatically](https://creator.poe.com/docs/server-bots/function-calling#running-functions-automatically)