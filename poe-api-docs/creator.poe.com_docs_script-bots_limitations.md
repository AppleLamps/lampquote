---
url: "https://creator.poe.com/docs/script-bots/limitations"
title: "Limitations | Poe Creator Platform"
---

# Limitations

Copy for LLMView as Markdown

## [Sandbox Limitations](https://creator.poe.com/docs/script-bots/limitations\#sandbox-limitations)

Script bots run in a secure, isolated sandbox environment. Here are the technical specifications and constraints:

### [Execution Environment Specs](https://creator.poe.com/docs/script-bots/limitations\#execution-environment-specs)

- **Memory**: 1.6 GB (includes file system)
- **CPU**: 0.5 core
- **Timeout**: 1 hour maximum execution time
- **Python Version**: 3.11.14
- **Operating System**: Linux-based container
- **Architecture**: x86\_64
- **Isolation**: Full isolation from host system and other containers
- **Persistence**: No sandbox persistence between runs - each execution starts with a fresh container

### [Pre-installed Python Libraries](https://creator.poe.com/docs/script-bots/limitations\#pre-installed-python-libraries)

Script bots have access to a wide range of Python libraries out of the box:

- **All Python standard library modules** (json, re, datetime, math, random, etc.)
- **Third-party packages**including:
  - **Web**: aiohttp, httpx, requests, beautifulsoup4, lxml
  - **Data science**: numpy, pandas, scipy
  - **Machine Learning/NLP**: spacy, nltk, textblob
  - **Image processing**: Pillow, opencv-python, pillow\_heif, imageio
  - **Data visualization**: matplotlib, seaborn, plotly
  - **File processing**: PyPDF2, PyMuPDF, python-docx, python-pptx, openpyxl, xlsxwriter, pdfplumber
  - **Audio/video**: pydub, librosa, audioread, soundfile
  - **Other utilities**: arrow, bcrypt, cryptography, faker, pydantic, pyyaml, regex, rich, tabulate, wordcloud
  - And many more - you can ask [Script Bot Creator](https://poe.com/Script-Bot-Creator) for a complete, updated list of available libraries.

If you need a library that isn't pre-installed, you can request it via the [Poe Discord community](https://discord.gg/WPEpVNRqwj) or feedback channels.

## [Network Access and Privacy Shields](https://creator.poe.com/docs/script-bots/limitations\#network-access-and-privacy-shields)

Full-shield and half-shield are existing privacy modes on Poe that apply to all bots, not just script bots. Here's what they mean specifically for script bots:

### [Full Shield (default)](https://creator.poe.com/docs/script-bots/limitations\#full-shield-default)

Most script bots should use full-shield mode, which provides strong privacy protections:

- **No direct external network access**: The bot cannot make requests to external websites or APIs directly
- **Communication via Poe bot calls only**: Can interact with the internet by calling other bots on Poe
- **Poe CDN is allowlisted**: Can download attachments from Poe's CDN without restrictions

**Calling half-shield bots**: If a full-shield script bot calls another half-shield bot, the user will be prompted to approve permissions.

However, if a full-shield bot attempts to make a direct external network call, it will **fail without prompting the user**. The bot must be declared as half-shield upfront to make direct network calls.

### [Half Shield](https://creator.poe.com/docs/script-bots/limitations\#half-shield)

Half-shield mode enables direct external network access:

- **Direct external network access**: Can make HTTP requests, scrape websites, call external APIs, etc.
- **Enable with code comment**: Add `# poe: privacy_shield=half` at the top of your bot's code
- **Useful for upfront permission**: If your bot always calls other half-shield bots, declaring it as half-shield lets Poe request permission upfront instead of interrupting mid-execution

For more details on privacy modes and how they work across Poe, visit the [Poe Privacy Center](https://poe.com/privacy_center).

* * *

If you have specific use cases that are blocked by current limitations, we'd love to hear about them in the [Poe Discord community](https://discord.gg/WPEpVNRqwj)!

On this page

[Sandbox Limitations](https://creator.poe.com/docs/script-bots/limitations#sandbox-limitations) [Execution Environment Specs](https://creator.poe.com/docs/script-bots/limitations#execution-environment-specs) [Pre-installed Python Libraries](https://creator.poe.com/docs/script-bots/limitations#pre-installed-python-libraries) [Network Access and Privacy Shields](https://creator.poe.com/docs/script-bots/limitations#network-access-and-privacy-shields) [Full Shield (default)](https://creator.poe.com/docs/script-bots/limitations#full-shield-default) [Half Shield](https://creator.poe.com/docs/script-bots/limitations#half-shield)