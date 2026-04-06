---
url: "https://creator.poe.com/docs/script-bots/poe-python-reference"
title: "Poe Python Reference | Poe Creator Platform"
---

# Poe Python Reference

Copy for LLMView as Markdown

The following is an API reference for the Poe Python library. This library
is auto-imported to the `poe` namespace on Poe Python interpreter startup.
The reference assumes that you used `import fastapi_poe as fp`. See also
[fastapi\_poe: Python API Reference](https://creator.poe.com/docs/server-bots/fastapi_poe-python-reference)
for more low-level functionality.

## [`poe.Sender`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poesender)

A simple dataclass representing an author/sender of a message in chat.

#### [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference\#fields)

- `role` (`Literal["user", "bot", "system", "tool"]`): a string representing
the sender's role. The only allowed values are `user`, `bot`, `system`, or `tool`.
- `id` (`str | None = None`): a _unique_ identifier of a bot or user.
- `name` (`str | None = None`): a display name of a user or bot.

* * *

## [`poe.UserMember`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeusermember)

A simple dataclass representing a user member in a chat.

#### [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference\#fields-1)

- `name` (`str | None`): the display name of the user.
- `user_identifier` (`str`): a unique identifier for the user.
- `photo_url` (`str`): URL to the user's profile photo.

* * *

## [`poe.Attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeattachment)

A class representing a message attachment. Attachments are stored in Poe's
infrastructure and are accessible to users and bots in the chat. You can create
an attachment by specifying either its content or a URL (but not both):

```
one_attachment = poe.Attachment(
    name="report.csv", contents=b"a,b,c\n1,2,3",
)
other_attachment = poe.Attachment(
    name="tiger",
    url="http://my.hosting.com/tiger.jpg",
    content_type="image/jpeg",
    is_inline=True,
)
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters)

- `name` (`str`): name of the attachment file (required).
- `contents` (`bytes | None = None`): contents of the attachment encoded as bytes.
- `url` (`str | None = None`): a URL of the attachment. For third-party URLs, the
attachment will be downloaded, and re-uploaded to Poe's infrastructure.
- `content_type` (`str | None = None`): content type of the attachment as a MIME string
(e.g. `image/jpeg`). If not provided, Poe backend will attempt to infer the content type
from the contents.
- `is_inline` (`bool = False`): whether this attachment should be rendered inline,
or at the end of the message. This is only supported for image attachments
in Markdown messages.

#### [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference\#properties)

- `name` (`str`): name of the attachment.
- `content_type` (`str`): attachment content type (provided or inferred).
- `url` (`str`): attachment URL (this will _always_ points to Poe's storage).
- `inline_ref` (`str | None`): a string with Markdown reference for this attachment.
If `is_inline=False` was specified in the constructor, this will be set to `None`.

### [`Attachment.get_contents`](https://creator.poe.com/docs/script-bots/poe-python-reference\#attachmentget_contents)

Fetch (if needed) and return the content of the attachment.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns)

- `bytes`: attachment content encoded as a Python bytes object.

### [`Attachment.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference\#attachmentcopy)

Return a (possibly modified) copy of the attachment. Attachments are immutable
objects, so this should be used in situations where you want to modify some
fields of an existing attachment object.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-1)

- `name` (`str = ...`): new name of the attachment file. If not provided, the original
name will be used.
- `is_inline` (`bool = ...`): new value of the inline status of the attachment. If not
provided, the original inline status is used.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-1)

- `poe.Attachment`: new attachment object copied from the original.

### [`Attachment.from_protocol_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference\#attachmentfrom_protocol_attachment)

Convert a low-level `fastapi_poe` attachment object into an equivalent
`poe.Attachment` object.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-2)

- `a` (`fp.Attachment`): a low-level attachment object to convert.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-2)

- `poe.Attachment`: an attachment object equivalent to the low-level input.

### [`Attachment.to_protocol_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference\#attachmentto_protocol_attachment)

Converts the `poe.Attachment` object into a low-level `fastapi_poe` attachment object.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-3)

- `fp.Attachment`: new `fastapi_poe` attachment object equivalent to the original
attachment.

### [`Attachment.__add__` and `Attachment.__radd__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#attachment__add__-and-attachment__radd__)

Attachments support the `+` operator to easily transform a string into a message
with the attachment or to add the attachment to an existing message. For example:

```
message = poe.Message(text="Here's my report")

# Create an attachment in another message.
with poe.start_message() as other_message:
    attachment = other_message.attach_file(
        name="data.csv",
        contents=b"a,b,c\n1,2,3",
    )

# Combine the message with the attachment.
message_with_attachment = message + attachment
# The opposite order works as well.
message_with_attachment = attachment + message
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-3)

- `other` (`str | poe.Message`): the second operand for `+` can be either a plain
Python string, or a message object.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-4)

- `poe.Message`: a new message with the attachment appended or prepended.

* * *

## [`poe.Message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poemessage)

A class representing a message in a chat. It is essentially an extended version of
Python string. Although it supports incremental construction, it is handled as
immutable in most contexts. To create a mutable message, pass `in_progress=True`
to the constructor. This will enable various methods modifying the message (see below).
It is recommended to call `msg.finish()` when modifications are not needed anymore.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-4)

- `text` (`str`): text of the message.
- `sender` (`poe.Sender | Literal["user", "bot", "system", "tool"] = "user"`): sender
of the message. You can provide either a `poe.Sender` object or a plain string. In the
latter case, it will be converted to `poe.Sender(role=sender, id=None, author=None)`.
- `content_type` (`Literal["text/markdown", "text/plain"] = "text/markdown"`): content
type of the message. Currently plain text and Markdown messages are supported.
- `attachments` (`list[poe.Attachment] | None = None`): a list of attachments to include
in the message.
- `in_progress` (`bool = False`): if `True`, allow updating content of the message.
This may be useful when streaming a response from a bot. It is recommended to call
`msg.finish()` as soon as you don't expect more updates.
- `is_tool_call` (`bool = False`): if `True` this message is created for the purpose of
tool calling protocol. Its content should be a serialized JSON and not human readable.
Only use this flag if you want to control tool call loop manually.
- `parameters` (`dict[str, Any] | None = None`): a JSON dictionary with any bot-specific
parameters for this message.

#### [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference\#properties-1)

- `text` (`str`): text of the message.
- `role` (`Literal["user", "bot", "system", "tool"]`): role of the message author. This
is an alias to `msg.sender.role`.
- `sender` (`poe.Sender`): sender of this message.
- `content_type` (`Literal["text/markdown", "text/plain"]`): content type of the message.
- `attachments` (`tuple[poe.Attachment, ...]`): attachments attached to this message as
an (immutable) tuple.
- `is_tool_call` (`bool`): if `True` this message is created for the purpose of
tool calling protocol.
- `parameters` (`dict[str, Any]`): a JSON dictionary with any bot-specific
parameters for this message.

### [`Message.write`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messagewrite)

Append a string to the message text. This method will raise a `ValueError` exception
if the message was created with `in_progress=False`, or after a call to `msg.finish()`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-5)

- `text` (`str`): a string to append to the message text.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none)

### [`Message.overwrite`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messageoverwrite)

Overwrite message text with a new value. This method will raise a `ValueError`
exception if the message was created with `in_progress=False`, or after a call
to `msg.finish()`. For example:

```
import time

msg = poe.Message(text="thinking...", in_progress=True)
time.sleep(5)
msg.overwrite("No solutions found!")
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-6)

- `text` (`str`): a new value of the message text.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-1)

### [`Message.fail`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messagefail)

Mark an in-progress message as failed. This
will raise a `ValueError` if the message was created with `in_progress=False`,
or after a call to `msg.finish()`. If the message was already attached to the
chat UI, the UI will be updated with the failure.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-7)

- `error_text` (`str`): the error message to display to the user.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-2)

#### [Example:](https://creator.poe.com/docs/script-bots/poe-python-reference\#example)

```
with poe.start_message() as msg:
    msg.write("Working...")
    msg.fail("Something went wrong")
```

### [`Message.add_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messageadd_attachment)

Add an existing attachment object to this message. If the message content type is
Markdown and the attachment is inline, an inline reference to the attachment will be
(optionally) appended to the message text. This method will raise a `ValueError`
exception if the message was created with `in_progress=False`, or after a call
to `msg.finish()`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-8)

- `attachment` (`poe.Attachment`): an attachment to add to the message.
- `add_inline_ref` (`bool = True`): if `True` (default) automatically append
a Markdown reference to the message text if the attachment is inline.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-3)

### [`Message.update`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messageupdate)

Update the message as specified by a `fp.PartialResponse` object. This will call
`msg.write()`, `msg.overwrite()`, and/or `msg.add_attachment()` automatically.
This method will raise a `ValueError` exception if the message was created with
`in_progress=False`, or after a call to `msg.finish()`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-9)

- `part` (`fp.PartialResponse`): an item in the response stream from a bot.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-4)

### [`Message.attach_file`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messageattach_file)

Create a new attachment with the specified content, and attach it to the message.
This is a convenience helper that calls `poe.Attachment(...)` followed by
`msg.add_attachment()`. This method will raise a `ValueError` exception if the message
was created with `in_progress=False`, or after a call to `msg.finish()`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-10)

- `name` (`str`): name of the attachment file.
- `contents` (`bytes`): contents of the attachment encoded as bytes.
- `content_type` (`str | None = None`): content type of the attachment, if not
provided, Poe backend will attempt to infer the content type from the contents.
- `is_inline` (`bool = False`): whether this attachment should be rendered inline,
or at the end of the message. This is only supported for image attachments
in Markdown messages.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-5)

- `poe.Attachment`: a newly created attachment object that was added to the message.

### [`Message.finish`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messagefinish)

Calling this method will prevent any future updates to the message. This method
will raise a `ValueError` exception if the message was created with `in_progress=False`,
or if it was already called before.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-5)

### [`Message.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messagecopy)

Return a (possibly modified) shallow copy of the message. Finished messages are
immutable objects, so this should be used in situations where you want to modify
some fields of an existing message object. You cannot copy a message that is still
in progress. This method will raise a `ValueError` exception if the message was created
with `in_progress=True` and `msg.finish()` was not called.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-11)

- `text` (`str = ...`): If not provided, the original
text will be used.
- `sender` (`poe.Sender | Literal["user", "bot", "system", "tool"] = ...`): If not
provided, the original sender will be used.
- `attachments` (`list[poe.Attachment] = ...`): If not provided, the original
attachments will be used.
- `parameters` (`dict[str, Any] = ...`): If not provided, the original
parameters will be used.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-6)

- `poe.Message`: new message object copied from the original.

### [`Message.from_protocol_message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messagefrom_protocol_message)

Convert a low-level `fastapi_poe` message object into an equivalent
`poe.Message` object.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-12)

- `m` (`fp.ProtocolMessage`): a low-level message object to convert.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-7)

- `poe.Message`: a message object equivalent to the low-level input.

### [`Message.to_protocol_message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#messageto_protocol_message)

Converts the `poe.Message` object into a low-level `fastapi_poe` message object.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-8)

- `fp.ProtocolMessage`: new `fastapi_poe` message object equivalent to the original
attachment.

### [`Message.__add__` and `Message.__radd__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#message__add__-and-message__radd__)

Messages support the `+` operator to easily concatenate two messages, add a string
to the message text, or add some attachment(s).

```
# Combine messages with strings.
greeting = poe.Message(text="Hello, ")
name = "Alice"
full_greeting = greeting + name

# Combine multiple messages.
question = poe.Message(text="What is ")
topic = poe.Message(text="quantum computing")
question_mark = "?"
full_question = question + topic + question_mark
```

> **Note**: If both operands are messages, the fields of the right operand will
> take precedence when merging.
> The `parameters` field will be shallow merged with the precedence of the right
> values for colliding keys.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-13)

- `other` (`str | poe.Message | poe.Attachment | list[poe.Attachment]`): the other
operand of the `+` operator. This can be a string, another message, an attachment, or
a list of attachments.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-9)

- `poe.Message`: a new message object that represents the concatenation of
the operands.

### [`Message.__enter__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#message__enter__)

The `poe.Message` class implements context manager protocol, that will
call `msg.finish()` when exiting context manager. It is recommended to use the
context manager syntax instead of calling `msg.finish()` manually.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-10)

- `poe.Message`: the original message object.

### [`Message.__contains__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#message__contains__)

Messages support the Python `in` operator and will check if the given substring
is present in the message text. So that `some_text in msg` is a shorthand for
`some_text in msg.text`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-14)

- `item` (`str`): a substring to search in the message text.

### [`Message.__format__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#message__format__)

Messages can be used in f-strings directly, their text will be used automatically:

```
# No need to use message.text below.
message = poe.Message(text="Attention!")
bold_text = f"**{message}**"
```

* * *

## [`poe.Chat(Sequence[poe.Message])`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poechatsequencepoemessage)

This class represents a chat, a sequence of messages. This may be an abstract
sequence of messages, not necessarily the one you see in Poe chat UI. This
class implements full Python sequence protocol.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-15)

- `*args` (`str | poe.Message | poe.Chat`): all positional arguments should be either a string, a message, or another chat. They will be flattened and available as a `messages`
field.
- `initial_length` (`int | None = None`): all messages after this number are considered
new messages. If not provided, this is set to number of messages used in constructor.
This can be used to track which messages were added by which bot calls, for example
using `Chat.make_child()` and/or `Chat.new_messages()`.
- `quiet` (`bool = True`): If `False`, each message added to this chat after its creation
will be echoed to the Poe chat UI.
- `user_members` (`list[poe.UserMember] | None = None`): a list of user members in the chat.

#### [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference\#properties-2)

- `last` (`poe.Message`): last message in chat. This an alias to `chat.messages[-1]`.
- `text` (`str`): text of all messages in chat concatenated using newline. Messages with
`is_tool_call=True` are not included.
- `user_members` (`list[poe.UserMember]`): a list of user members in the chat.

### [`Chat.add_message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatadd_message)

Add a new message to chat. If chat was created with `quiet=False` this will also echo
the message in Poe chat UI.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-16)

- `message` (`poe.Message | str`): a message to add to the chat. A string will be
converted to `poe.Message(text=message)`.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-6)

### [`Chat.add_messages`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatadd_messages)

Add multiple messages to chat. If `quiet=False` this will also echo the messages in Poe
chat UI.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-17)

- `messages` (`Iterable[poe.Message | str]`): messages to add to chat. Each string will
be converted to `poe.Message(text=message)`.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-7)

### [`Chat.start_message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatstart_message)

Create a new empty message with `in_progress=True` and call `chat.add_message()` using
it as argument. Since `poe.Message` objects implement context manager protocol, you
can use the context manager pattern (recommended). For example:

```
chat = poe.Chat(quiet=False)
with chat.start_message() as msg:
    msg.write("Hello!")
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-18)

- `sender` (`poe.Sender | Literal["user", "bot", "system", "tool"] | None = None`): sender
of the new message. A plain string will be converted to `poe.Sender(role=sender)`.
The default value `None` is converted to a sender representing the current bot
`poe.Sender(role="bot", name=poe.bot_name)`.
- `content_type` (`Literal["text/markdown", "text/plain"] = "text/markdown"`): content
type of the new message.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-11)

- `poe.Message`: the newly created message.

### [`Chat.make_child`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatmake_child)

Creates a copy of the chat with `initial_length` set to the current
number of messages. You can use this method to create multiple independent
continuations of the current chat and track which messages were added to each
child chat.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-12)

- `poe.Chat`: the newly created chat.

### [`Chat.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatcopy)

Creates a copy of the chat, optionally with modified `quiet` status.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-19)

- `quiet` (`bool | None = None`): quiet status for the copy. If not provided,
the original quiet status will be used.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-13)

- `poe.Chat`: the newly created chat.

### [`Chat.new_messages`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatnew_messages)

Return a list of new messages in chat. That is all messages after `initial_length`.
This gives easy access to messages that were added by bot calls after `Chat` object
creation (i.e. without the initial prompts).

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-14)

- `list[poe.Message]`: new messages in chat.

### [`Chat.summarize`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chatsummarize)

A short, human readable summary of messages in chat.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-15)

- `str`: the chat summary.

### [`Chat.__iadd__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chat__iadd__)

Chats support `+=` operator that will add a message or messages in place.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-20)

- `other` (`poe.Message | str | Iterable[poe.Message | str]`): the right operand
to `+=` operator. This can be either a message, or a list of messages.

### [`Chat.__contains__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chat__contains__)

Chats support Python `in` operator. Its semantics depends on the type of left operand:
if it is a string, this will return `True` if the string is contained in any of the chat
messages. If left operand is a message, this will return `True` only if an equal message
appears in the chat. For example:

```
test_chat = poe.Chat("testing...")
assert "test" in test_chat
assert poe.Message(text="test") not in test_chat
assert poe.Message(text="testing...") in test_chat
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-21)

- `item`(`poe.Message | str`): the left operand of the `in` operator.

### [`Chat.__enter__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chat__enter__)

Chat class implements the context manager protocol, that will temporarily
replace `poe.default_chat` with the current chat.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-16)

- `poe.Chat`: the chat object itself.

### [`Chat.__format__`](https://creator.poe.com/docs/script-bots/poe-python-reference\#chat__format__)

Similar to messages, chat can be used in f-strings directly. If it appears
in an f-string, the value of `text` property will be used.

* * *

## [`poe.call`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poecall)

Call a Poe bot.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-22)

- `bot_name` (`str`): the name of the bot to call. The initial `"@"` character will be
stripped from the name if present.
- `*prompts` (`str | poe.Message | poe.Chat`): each positional argument should be either
a string, a message, or a chat. All positional arguments will be normalized to a single
list of messages.
- `output` (`poe.Chat | None = None`): a chat to which bot response will be written.
The responses will be streamed to the output, so that the user can see the response
before the call returns.
- `tools` (`Sequence[Callable[..., Any]] = ()`): Python functions to make available to
the bot to call. Each function must have a docstring, and each argument must have a
`poe.Doc` annotation.
- `temperature` (`float | None = None`): temperature input to be used for model
inference. This parameter controls how "creative" the LLM should be. The smaller
the value, the more predictable the bot is. If not provided, the default value
for the given LLM will be used.
- `debug_show_chat` (`bool = False`): if `True`, print a message summarizing the chat
content that will be sent to the bot.
- `adopt_current_bot_name` (`bool = False`): Whether the called bot should identify as
itself, or adopt the identity of the script bot that is executing the script. Use
`True` when you want the bot to respond as if it _is_ the script, rather than being
aware it's a separate bot being consulted by the script. This flag is useful to
replicate a [prompt bot](https://creator.poe.com/docs/prompt-bots/how-to-create-a-prompt-bot) functionality.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-17)

- `poe.Chat`: a chat that contains messages returned by the bot.

* * *

## [`poe.stream`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poestream)

Call a Poe bot and stream the responses as they become available.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-23)

- `bot_name` (`str`): the name of the bot to call. The initial `"@"` character will be
stripped from the name if present.
- `*prompts` (`str | poe.Message | poe.Chat`): each positional argument should be either
a string, a message, or a chat. All positional arguments will be normalized to a single
list of messages.
- `tools` (`Sequence[Callable[..., Any]] = ()`): Python functions to make available to
the bot to call. Each function must have a docstring, and each argument must have a
`poe.Doc` annotation.
- `temperature` (`float | None = None`): temperature input to be used for model
inference. This parameter controls how "creative" the LLM should be. The smaller
the value, the more predictable the bot is. If not provided, the default value
for the given LLM will be used.
- `adopt_current_bot_name` (`bool = False`): Whether the called bot should identify as
itself, or adopt the identity of the script bot that is executing the script. Use
`True` when you want the bot to respond as if it _is_ the script, rather than being
aware it's a separate bot being consulted by the script. This flag is useful to
replicate a [prompt bot](https://creator.poe.com/docs/prompt-bots/how-to-create-a-prompt-bot) functionality.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-18)

- `Iterator[fp.PartialResponse]`: an iterator that yields response parts as soon as they
become available.

* * *

## [`poe.parallel`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeparallel)

Execute multiple function calls in parallel. This also handles concurrent chat writes,
so it can be used to make parallel bot calls. Exceptions are either raised, returned,
or ignored. Only one of `return_exceptions` and `skip_exceptions` can be `True`.

> **Note**: Functions are executed by a fixed size thread pool, so it is not guaranteed
> that all calls will be parallel. The current size of the pool is 21 threads and may
> change in the future.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-24)

- `*tasks` (`Callable[[], T]`): each positional argument is a function that takes no
arguments.
- `return_exceptions` (`bool = False`): if `True` any exception raised during a function
execution will be returned as a value of that function.
- `skip_exceptions` (`bool = False`): if `True` all exceptions are ignored. In this case
the list of results may be shorter than the number of positional arguments.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-19)

- `list[T | BaseException]`: a list of function results.

* * *

## [`poe.repeat`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poerepeat)

Execute the same function that takes no arguments multiple times in parallel.
All exceptions are ignored.

> **Note**: The function is executed by a fixed size thread pool, so it is not guaranteed
> that all calls will be parallel. The current size of the pool is 21 threads and may
> change in the future.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-25)

- `n` (`int`): the number of times to execute the function.
- `func` (`Callable[[], T]`): the function to call multiple times in parallel.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-20)

- `list[T]`: a list of function results.

* * *

## [`poe.start_message`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poestart_message)

This is an alias to `poe.default_chat.start_message`.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-26)

- `sender` (`poe.Sender | Literal["user", "bot", "system", "tool"] = "user"`): sender of
the new message. A plain string will be converted to `poe.Sender(role=sender)`.
- `content_type` (`Literal["text/markdown", "text/plain"] = "text/markdown"`): content
type of the new message.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-21)

- `poe.Message`: the newly created message.

* * *

## [`poe.call_tools`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poecall_tools)

Execute tool calls requested by an LLM.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-27)

- `tool_call_request` (`poe.Message`): a message object with the tool call request
as a serialized JSON list of `fp.ToolCallDefinition` objects.
- `tools` (`Sequence[Callable[..., Any]]`): a sequence of Python functions.

#### [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-22)

- `poe.Message`: a message with tool call results. The message text is a serialized
JSON list of corresponding `fp.ToolResultDefinition` objects.

* * *

## [`poe.update_tool_calls`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeupdate_tool_calls)

Aggregate tool call deltas from a stream of LLM partial responses. This is handy,
since usually LLMs stream tool call requests incrementally, as some details of the
desired tool call become available.

> **Note**: An LLM may request multiple tool calls, in this case they will be identified
> by unique integer identifiers for each call request.

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-28)

- `tool_calls` (`dict[int, fp.ToolCallDefinition]`): a dictionary of aggregated tool
call requests. The keys are call request ids. This dictionary is _updated in place_
by the function.
- `tool_calls_deltas` (`list[fp.ToolCallDefinitionDelta]`): a list of tool call deltas
from an LLM.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-8)

* * *

## [`poe.query`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poequery)

This is a `poe.Message` object with a user message that triggered this script
execution. If execution was started manually, accessing this property will raise
a `ValueError` exception.

* * *

## [`poe.default_chat`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poedefault_chat)

This is a `poe.Chat` object with quiet flag set to `False` that is primed with the
content of the chat UI at the moment the script execution started.

> **Note**: This chat object is _not_ updated if someone posts to chat UI during
> script execution.

* * *

## [`poe.bot_name`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poebot_name)

A `str` object with the name of the current bot executing this script.

* * *

## [`poe.update_settings`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeupdate_settings)

Configure bot settings such as introduction message and parameter controls. This function
is called during bot creation and editing to extract settings from your script. Settings
extraction occurs when a user creates a new script bot or edits an existing one. During
extraction, Poe runs your script up to (but not including) the `if __name__ == "__main__":`
block. Any errors in the settings configuration code will be shown in an error modal,
allowing you to fix issues before the bot is saved.

> **Important**: Code inside `poe.update_settings()` runs during bot creation/edit,
> _not_ during chat. To separate settings configuration from runtime logic, wrap your
> chat handling code in `if __name__ == "__main__":`.

```
import poe
from fastapi_poe.types import SettingsResponse, ParameterControls, Section, Slider

# This runs during bot creation/edit to configure settings
poe.update_settings(SettingsResponse(
    introduction_message="Hello! I'm a configurable bot.",
    parameter_controls=ParameterControls(
        sections=[\
            Section(\
                name="Settings",\
                controls=[\
                    Slider(\
                        label="Creativity",\
                        parameter_name="creativity",\
                        default_value=50,\
                        min_value=0,\
                        max_value=100,\
                        step=10,\
                    ),\
                ],\
            )\
        ]
    ),
))

# This runs only during actual chat, not during settings extraction
if __name__ == "__main__":
    creativity = poe.query.parameters.get("creativity", 50)
    print(poe.call("GPT-4o", f"Be creative at level {creativity}: {poe.query.text}"))
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-29)

- `settings` (`fp.SettingsResponse`): A settings response object containing bot configuration.
Common fields include:
  - `introduction_message` (`str`): A message shown to users at the start of a chat.
  - `parameter_controls` (`fp.ParameterControls`): Interactive UI controls for user input.
    See [Parameter Controls](https://creator.poe.com/docs/server-bots/parameter-controls) for details.

#### [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference\#returns-none-9)

* * *

## [`poe.Doc`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poedoc)

This is an annotation to use for argument types in functions passed as tools
in bot calls. For example:

```
def get_weather(
    location: poe.Doc[str, "City name or location to get weather for"]
) -> str:
    """Get current weather information for a specified location"""
    ...
```

* * *

## [`poe.BotError`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeboterror)

A custom exception class to indicate an error during script execution. For example:

```
if "cat" not in poe.query:
    raise poe.BotError("I only talk about cats!")
```

#### [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference\#fields-2)

- `message` (`str`): an error message to show to the user.

* * *

## [`poe.set_query`](https://creator.poe.com/docs/script-bots/poe-python-reference\#poeset_query)

A context manager to temporarily override content of `poe.query`. This may be useful
for testing your script. For example:

```
with poe.set_query("Testing..."):
    assert poe.query.text == "Testing..."
```

#### [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference\#parameters-30)

- `query` (`poe.Message | str`): a new message to set as a user query. A plain string
will be converted to `poe.Message(text=query)`.

* * *

## [`builtins.print`](https://creator.poe.com/docs/script-bots/poe-python-reference\#builtinsprint)

The Python builtin `print()` function is modified to post a message to Poe chat UI
instead of printing to the standard output.

* * *

## [`builtins.input`](https://creator.poe.com/docs/script-bots/poe-python-reference\#builtinsinput)

The Python builtin `input()` function is not supported yet, and will raise
a `NotImplementedError` exception if called.

On this page

[`poe.Sender`](https://creator.poe.com/docs/script-bots/poe-python-reference#poesender) [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference#fields) [`poe.UserMember`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeusermember) [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference#fields-1) [`poe.Attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeattachment) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters) [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference#properties) [`Attachment.get_contents`](https://creator.poe.com/docs/script-bots/poe-python-reference#attachmentget_contents) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns) [`Attachment.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference#attachmentcopy) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-1) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-1) [`Attachment.from_protocol_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference#attachmentfrom_protocol_attachment) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-2) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-2) [`Attachment.to_protocol_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference#attachmentto_protocol_attachment) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-3) [`Attachment.__add__` and `Attachment.__radd__`](https://creator.poe.com/docs/script-bots/poe-python-reference#attachment__add__-and-attachment__radd__) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-3) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-4) [`poe.Message`](https://creator.poe.com/docs/script-bots/poe-python-reference#poemessage) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-4) [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference#properties-1) [`Message.write`](https://creator.poe.com/docs/script-bots/poe-python-reference#messagewrite) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-5) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none) [`Message.overwrite`](https://creator.poe.com/docs/script-bots/poe-python-reference#messageoverwrite) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-6) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-1) [`Message.fail`](https://creator.poe.com/docs/script-bots/poe-python-reference#messagefail) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-7) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-2) [Example:](https://creator.poe.com/docs/script-bots/poe-python-reference#example) [`Message.add_attachment`](https://creator.poe.com/docs/script-bots/poe-python-reference#messageadd_attachment) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-8) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-3) [`Message.update`](https://creator.poe.com/docs/script-bots/poe-python-reference#messageupdate) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-9) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-4) [`Message.attach_file`](https://creator.poe.com/docs/script-bots/poe-python-reference#messageattach_file) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-10) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-5) [`Message.finish`](https://creator.poe.com/docs/script-bots/poe-python-reference#messagefinish) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-5) [`Message.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference#messagecopy) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-11) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-6) [`Message.from_protocol_message`](https://creator.poe.com/docs/script-bots/poe-python-reference#messagefrom_protocol_message) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-12) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-7) [`Message.to_protocol_message`](https://creator.poe.com/docs/script-bots/poe-python-reference#messageto_protocol_message) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-8) [`Message.__add__` and `Message.__radd__`](https://creator.poe.com/docs/script-bots/poe-python-reference#message__add__-and-message__radd__) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-13) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-9) [`Message.__enter__`](https://creator.poe.com/docs/script-bots/poe-python-reference#message__enter__) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-10) [`Message.__contains__`](https://creator.poe.com/docs/script-bots/poe-python-reference#message__contains__) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-14) [`Message.__format__`](https://creator.poe.com/docs/script-bots/poe-python-reference#message__format__) [`poe.Chat(Sequence[poe.Message])`](https://creator.poe.com/docs/script-bots/poe-python-reference#poechatsequencepoemessage) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-15) [Properties:](https://creator.poe.com/docs/script-bots/poe-python-reference#properties-2) [`Chat.add_message`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatadd_message) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-16) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-6) [`Chat.add_messages`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatadd_messages) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-17) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-7) [`Chat.start_message`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatstart_message) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-18) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-11) [`Chat.make_child`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatmake_child) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-12) [`Chat.copy`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatcopy) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-19) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-13) [`Chat.new_messages`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatnew_messages) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-14) [`Chat.summarize`](https://creator.poe.com/docs/script-bots/poe-python-reference#chatsummarize) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-15) [`Chat.__iadd__`](https://creator.poe.com/docs/script-bots/poe-python-reference#chat__iadd__) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-20) [`Chat.__contains__`](https://creator.poe.com/docs/script-bots/poe-python-reference#chat__contains__) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-21) [`Chat.__enter__`](https://creator.poe.com/docs/script-bots/poe-python-reference#chat__enter__) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-16) [`Chat.__format__`](https://creator.poe.com/docs/script-bots/poe-python-reference#chat__format__) [`poe.call`](https://creator.poe.com/docs/script-bots/poe-python-reference#poecall) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-22) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-17) [`poe.stream`](https://creator.poe.com/docs/script-bots/poe-python-reference#poestream) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-23) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-18) [`poe.parallel`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeparallel) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-24) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-19) [`poe.repeat`](https://creator.poe.com/docs/script-bots/poe-python-reference#poerepeat) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-25) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-20) [`poe.start_message`](https://creator.poe.com/docs/script-bots/poe-python-reference#poestart_message) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-26) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-21) [`poe.call_tools`](https://creator.poe.com/docs/script-bots/poe-python-reference#poecall_tools) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-27) [Returns:](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-22) [`poe.update_tool_calls`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeupdate_tool_calls) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-28) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-8) [`poe.query`](https://creator.poe.com/docs/script-bots/poe-python-reference#poequery) [`poe.default_chat`](https://creator.poe.com/docs/script-bots/poe-python-reference#poedefault_chat) [`poe.bot_name`](https://creator.poe.com/docs/script-bots/poe-python-reference#poebot_name) [`poe.update_settings`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeupdate_settings) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-29) [Returns: `None`](https://creator.poe.com/docs/script-bots/poe-python-reference#returns-none-9) [`poe.Doc`](https://creator.poe.com/docs/script-bots/poe-python-reference#poedoc) [`poe.BotError`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeboterror) [Fields:](https://creator.poe.com/docs/script-bots/poe-python-reference#fields-2) [`poe.set_query`](https://creator.poe.com/docs/script-bots/poe-python-reference#poeset_query) [Parameters:](https://creator.poe.com/docs/script-bots/poe-python-reference#parameters-30) [`builtins.print`](https://creator.poe.com/docs/script-bots/poe-python-reference#builtinsprint) [`builtins.input`](https://creator.poe.com/docs/script-bots/poe-python-reference#builtinsinput)