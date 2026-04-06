---
url: "https://creator.poe.com/docs/external-applications/interface-configuration"
title: "Interface Configuration | Poe Creator Platform"
---

# Interface Configuration

Copy for LLMView as Markdown

# Guide for Interface Configuration

This guide walks you through setting up Poe API with popular AI coding tools. With Poe's OpenAI-compatible API, you can access hundreds of AI models including GPT-5.4, Claude Sonnet 4.6, Gemini 3 Pro, and more through your existing coding workflow.

## [Prerequisites](https://creator.poe.com/docs/external-applications/interface-configuration\#prerequisites)

Before setting up any interface, you'll need:

1. **Poe API Key**: Get your API key from [poe.com/api/keys](https://poe.com/api/keys)
2. **Poe Subscription**: An active Poe subscription to access the models
3. **Base URL**: `https://api.poe.com/v1/`

## [Available Models](https://creator.poe.com/docs/external-applications/interface-configuration\#available-models)

Popular models you can use include:

- `GPT-5.4` \- OpenAI's latest model
- `Claude-Sonnet-4.6` \- Anthropic's most capable model
- `Gemini-3-Pro` \- Google's flagship model
- `Llama-3.1-405B` \- Meta's largest open-source model
- `Grok-4` \- xAI's latest model

For a complete list, visit the [models endpoint](https://api.poe.com/v1/models) or check available models in the Poe web interface.

* * *

## [Cline Setup](https://creator.poe.com/docs/external-applications/interface-configuration\#cline-setup)

[Cline](https://github.com/cline/cline) is an autonomous coding agent that works as a VS Code extension.

### [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration\#step-by-step-configuration)

1. **Install Cline Extension**
   - Open VS Code
   - Go to Extensions (`Cmd/Ctrl + Shift + X`)
   - Search for "Cline" and install it
2. **Open Cline Settings**
   - Click the Cline icon in the Activity Bar
   - Or press `Cmd/Ctrl + Shift + P` and search "Cline: Open"
3. **Configure API Settings**
   - In the Cline panel, click the ⚙️ icon (Settings)
   - Select **OpenAI Compatible** as the API Provider
4. **Enter Poe Configuration**








```
API Provider: OpenAI Compatible
Base URL: https://api.poe.com/v1/
OpenAI Compatible API Key: [Your Poe API Key from poe.com/api/keys]
Model ID: Claude-Sonnet-4.6
```




Recommended models:
   - Claude-Sonnet-4.6
   - Claude-Opus-4.6
   - Gemini-3-Pro
5. **Model Configuration**
   - Cline supports: images, browser use
   - Cline does not support prompt caching
   - Optional: You can use different models for Plan and Act modes
6. **Verify Setup**
   - Start a new conversation with Cline
   - Give it a simple coding task to test

### [Usage Tips for Cline](https://creator.poe.com/docs/external-applications/interface-configuration\#usage-tips-for-cline)

- Cline uses complex prompts and works best with Claude models
- Cline can read, write, and execute code autonomously
- It works best with specific, well-defined tasks
- Always review code changes before accepting them

* * *

## [Roo Code Setup](https://creator.poe.com/docs/external-applications/interface-configuration\#roo-code-setup)

Roo Code is an AI coding assistant that integrates with various development environments.

### [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration\#step-by-step-configuration-1)

1. **Install Roo Code**
   - Install Roo Code for your preferred development environment
2. **Access Settings**
   - Click the Roo Code icon in your editor
   - Click the ⚙️ icon (Settings) to open the configuration panel
   - Navigate to the **Providers** section
3. **Configure API Provider**
   - Select **OpenAI Compatible** from the API Provider dropdown
4. **Enter Poe Configuration**








```
Base URL: https://api.poe.com/v1/
API Key: [Your Poe API Key from poe.com/api/keys]
Model: [Select a model like Claude-Sonnet-4.6]
```




Recommended models:
   - Claude-Sonnet-4.6
   - Claude-Opus-4.6
   - Gemini-3-Pro
5. **Optional Settings**
   - Enable streaming for real-time responses
   - Include max output tokens if needed
   - Set Context Window Size (e.g., 128000)
   - Configure other settings based on your needs
6. **Test Connection**
   - Start a new conversation to confirm setup

### [Usage Tips for Roo Code](https://creator.poe.com/docs/external-applications/interface-configuration\#usage-tips-for-roo-code)

- Roo Code works best with GPT-5.4 for general coding tasks
- Some models support images, check the "Image Support" indicator
- Note that Poe models may not support computer use or prompt caching
- Experiment with different models for different tasks

* * *

## [LLM (Command Line Tool) Setup](https://creator.poe.com/docs/external-applications/interface-configuration\#llm-command-line-tool-setup)

[LLM](https://llm.datasette.io/en/stable/setup.html) is a command-line tool for working with Large Language Models. It provides a simple way to prompt various AI models directly from your terminal.

### [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration\#step-by-step-configuration-2)

1. **Install LLM**

Choose one of the following installation methods:








```
# Using pip
pip install llm

# Using pipx (recommended for CLI tools)
pipx install llm

# Using uv
uv tool install llm

# Using Homebrew (macOS/Linux)
brew install llm
```

2. **Configure Poe API Key**

Set your Poe API key using LLM's key management:








```
llm keys set poe
# Enter your Poe API key when prompted
```




Alternatively, use an environment variable:








```
export POE_API_KEY='your_poe_api_key_here'
```

3. **Test Basic Setup**

Try a simple prompt to verify the setup:








```
# Using stored key
llm "Hello, world!" --key poe --api-base https://api.poe.com/v1

# Using environment variable
llm "Hello, world!" --key $POE_API_KEY --api-base https://api.poe.com/v1
```

4. **Create Model Aliases**

For easier access, create aliases for your favorite Poe models:








```
# Set Claude Sonnet 4.6 as default
llm models default claude-sonnet-4.6 --api-base https://api.poe.com/v1 --key poe

# Or create specific aliases
llm alias claude "Claude-Sonnet-4.6" --api-base https://api.poe.com/v1 --key poe
llm alias gpt4 "GPT-5.4" --api-base https://api.poe.com/v1 --key poe
```

5. **Configuration File Setup**

For persistent configuration, you can set up a configuration file. The config location varies by OS:


   - **macOS**: `~/Library/Application Support/io.datasette.llm/`
   - **Linux**: `~/.config/io.datasette.llm/`

Create or edit the configuration to include Poe settings.

### [Usage Examples](https://creator.poe.com/docs/external-applications/interface-configuration\#usage-examples)

**Basic prompting:**

```
# Simple prompt with specific model
llm "Explain quantum computing" -m Claude-Sonnet-4.6 --api-base https://api.poe.com/v1 --key poe

# Using alias (if configured)
llm "Write a Python function to calculate fibonacci" -m claude
```

**Interactive chat:**

```
# Start an interactive session
llm chat -m GPT-5.4 --api-base https://api.poe.com/v1 --key poe
```

**File input:**

```
# Process a file
cat mycode.py | llm "Review this code for bugs" -m Claude-Sonnet-4.6 --api-base https://api.poe.com/v1 --key poe

# Save conversation to file
llm "Explain machine learning" -m Gemini-3-Pro --api-base https://api.poe.com/v1 --key poe > explanation.txt
```

**Using templates:**

```
# Create a template for code review
llm template code-review "Review this code and suggest improvements: {code}"

# Use the template
llm -t code-review -v code "$(cat script.py)" -m Claude-Sonnet-4.6 --api-base https://api.poe.com/v1 --key poe
```

### [Environment Setup](https://creator.poe.com/docs/external-applications/interface-configuration\#environment-setup)

For convenience, you can set these environment variables in your shell profile:

```
# Add to ~/.bashrc, ~/.zshrc, or equivalent
export POE_API_KEY='your_poe_api_key_here'
export LLM_API_BASE='https://api.poe.com/v1'

# Create aliases for common commands
alias llm-poe='llm --api-base $LLM_API_BASE --key $POE_API_KEY'
alias llm-claude='llm -m Claude-Sonnet-4.6 --api-base $LLM_API_BASE --key $POE_API_KEY'
alias llm-gpt='llm -m GPT-5.4 --api-base $LLM_API_BASE --key $POE_API_KEY'
```

### [Usage Tips for LLM](https://creator.poe.com/docs/external-applications/interface-configuration\#usage-tips-for-llm)

- **Logging**: LLM automatically logs conversations to SQLite. Use `llm logs off` to disable or `llm logs on` to enable
- **Multiple Models**: Easily switch between Poe models using the `-m` flag
- **Streaming**: LLM supports streaming responses for real-time output
- **Plugins**: Extend functionality with LLM plugins for specialized tasks
- **Templates**: Create reusable prompt templates for common workflows
- **Pipes**: LLM works great with Unix pipes for processing files and command output

### [Advanced Configuration](https://creator.poe.com/docs/external-applications/interface-configuration\#advanced-configuration)

**Custom model configuration:**

```
# List available models from Poe
curl -H "Authorization: Bearer $POE_API_KEY" https://api.poe.com/v1/models

# Use any model from the list
llm "Your prompt here" -m "Llama-3.1-405B" --api-base https://api.poe.com/v1 --key poe
```

**Batch processing:**

```
# Process multiple prompts from a file
while IFS= read -r prompt; do
  echo "Prompt: $prompt"
  llm "$prompt" -m Claude-Sonnet-4.6 --api-base https://api.poe.com/v1 --key poe
  echo "---"
done < prompts.txt
```

* * *

## [Troubleshooting](https://creator.poe.com/docs/external-applications/interface-configuration\#troubleshooting)

### [Common Issues](https://creator.poe.com/docs/external-applications/interface-configuration\#common-issues)

**"Invalid API Key" Error**

- Verify your API key from [poe.com/api/keys](https://poe.com/api/keys)
- Ensure there are no extra spaces or characters
- Check that your Poe subscription is active

**"Model Not Found" Error**

- Verify the model name is spelled correctly
- Use exact model names like `Claude-Sonnet-4.6` (model names are case-insensitive, but avoid including space characters)
- Check if the model is available with your subscription

**Connection Timeout**

- Verify the base URL: `https://api.poe.com/v1`
- Check your internet connection
- Try a different model if one seems unresponsive

**Rate Limiting**

- Poe has a 500 requests per minute limit
- Wait a moment before retrying
- Consider upgrading your subscription for higher limits

### [Getting Help](https://creator.poe.com/docs/external-applications/interface-configuration\#getting-help)

- **Poe API Documentation**: [OpenAI Compatible API docs](https://creator.poe.com/docs/external-applications/openai-compatible-api)
- **Support**: Contact [developers@poe.com](mailto:developers@poe.com)
- **Community**: Join discussion on [discord](https://discord.com/invite/joinpoe)

* * *

## [Benefits of Using Poe API](https://creator.poe.com/docs/external-applications/interface-configuration\#benefits-of-using-poe-api)

- **Single API Key**: Access hundreds of models with one key
- **Cost Effective**: Use existing Poe subscription points
- **Model Variety**: Switch between different providers and models
- **Up-to-date Models**: Access the latest models as they're released
- **Reliable Infrastructure**: Built for scale and performance

On this page

[Prerequisites](https://creator.poe.com/docs/external-applications/interface-configuration#prerequisites) [Available Models](https://creator.poe.com/docs/external-applications/interface-configuration#available-models) [Cline Setup](https://creator.poe.com/docs/external-applications/interface-configuration#cline-setup) [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration#step-by-step-configuration) [Usage Tips for Cline](https://creator.poe.com/docs/external-applications/interface-configuration#usage-tips-for-cline) [Roo Code Setup](https://creator.poe.com/docs/external-applications/interface-configuration#roo-code-setup) [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration#step-by-step-configuration-1) [Usage Tips for Roo Code](https://creator.poe.com/docs/external-applications/interface-configuration#usage-tips-for-roo-code) [LLM (Command Line Tool) Setup](https://creator.poe.com/docs/external-applications/interface-configuration#llm-command-line-tool-setup) [Step-by-Step Configuration](https://creator.poe.com/docs/external-applications/interface-configuration#step-by-step-configuration-2) [Usage Examples](https://creator.poe.com/docs/external-applications/interface-configuration#usage-examples) [Environment Setup](https://creator.poe.com/docs/external-applications/interface-configuration#environment-setup) [Usage Tips for LLM](https://creator.poe.com/docs/external-applications/interface-configuration#usage-tips-for-llm) [Advanced Configuration](https://creator.poe.com/docs/external-applications/interface-configuration#advanced-configuration) [Troubleshooting](https://creator.poe.com/docs/external-applications/interface-configuration#troubleshooting) [Common Issues](https://creator.poe.com/docs/external-applications/interface-configuration#common-issues) [Getting Help](https://creator.poe.com/docs/external-applications/interface-configuration#getting-help) [Benefits of Using Poe API](https://creator.poe.com/docs/external-applications/interface-configuration#benefits-of-using-poe-api)