---
url: "https://creator.poe.com/docs/server-bots/parameter-controls"
title: "Parameter Controls | Poe Creator Platform"
---

# Parameter Controls

Copy for LLMView as Markdown

Parameter Controls allow server bots to add additional input elements to their UI on Poe, enabling users to configure settings and provide structured input beyond just text messages.

## [Adding Parameter Controls to Your Bot](https://creator.poe.com/docs/server-bots/parameter-controls\#adding-parameter-controls-to-your-bot)

You can add parameter controls to your bot by setting the `parameter_controls` property inside the [SettingsResponse](https://creator.poe.com/docs/server-bots/fastapi_poe-python-reference#fpsettingsresponse) object ( [PoeBot:get\_settings](https://creator.poe.com/docs/server-bots/fastapi_poe-python-reference#poebotget_settings) method in the fastapi\_poe API) to a JSON object that uses the API described in the following sections.

The parameter controls system uses the following JSON structure to define its controls and settings:

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `api_version` | String | Version of the Parameter Controls schema. This matches the Poe Protocol response version. Currently only "2" is supported | Yes |
| `sections` | Array | List of Section objects that define the UI structure | Yes |

The schema shows that Sections are the fundamental building blocks - they act as containers that organize all other controls. Every interface must have at least one Section to function properly.

Here's a practical example showing how to create a server bot with parameter controls. This example creates a 'Generation' section containing two dropdown menus:

```
from fastapi_poe import PoeBot
from fastapi_poe.types import (
    AspectRatio,
    AspectRatioOption,
    DropDown,
    ParameterControls,
    Section,
    SettingsRequest,
    SettingsResponse,
    ValueNamePair,
)

class ImageBot(PoeBot):

    async def get_settings(self, setting: SettingsRequest) -> SettingsResponse:
        return SettingsResponse(
            enable_multi_entity_prompting=True,
            allow_attachments=True,
            enable_image_comprehension=False,
            parameter_controls=ParameterControls(
                sections=[\
                    Section(\
                        name="Generation",\
                        controls=[\
                            DropDown(\
                                label="Style",\
                                parameter_name="style",\
                                default_value="GENERAL",\
                                options=[\
                                    ValueNamePair(name="General", value="GENERAL"),\
                                    ValueNamePair(name="Realistic", value="REALISTIC"),\
                                    ValueNamePair(name="Design", value="DESIGN"),\
                                    ValueNamePair(name="3D render", value="RENDER_3D"),\
                                    ValueNamePair(name="Anime", value="ANIME"),\
                                ],\
                            ),\
                            AspectRatio(\
                                label="Aspect ratio",\
                                parameter_name="aspect",\
                                default_value="1:1",\
                                options=[\
                                    AspectRatioOption(width=16, height=9, value="16:9"),\
                                    AspectRatioOption(\
                                        width=16, height=10, value="16:10"\
                                    ),\
                                    AspectRatioOption(width=3, height=2, value="3:2"),\
                                    AspectRatioOption(width=4, height=3, value="4:3"),\
                                    AspectRatioOption(width=1, height=1, value="1:1"),\
                                    AspectRatioOption(width=9, height=16, value="9:16"),\
                                    AspectRatioOption(\
                                        width=10, height=16, value="10:16"\
                                    ),\
                                    AspectRatioOption(width=2, height=3, value="2:3"),\
                                    AspectRatioOption(width=3, height=4, value="3:4"),\
                                ],\
                            ),\
                        ],\
                    )\
                ]
            )
        )
```

## [Getting Parameter Values from User Messages](https://creator.poe.com/docs/server-bots/parameter-controls\#getting-parameter-values-from-user-messages)

When a user submits a message, any configured parameter values will be included in the ProtocolMessage object within a dedicated `parameters` field. The parameters field is an object where the parameters will be sent as:

```
{
    "some_text_parameter": "some value",
    "some_number_paramter": 123, //some value
}
```

This field is sent alongside the standard `content` field, allowing your bot to access both the user's message content and their parameter configurations in a structured format.

See [Parameters](https://creator.poe.com/docs/server-bots/parameter-controls#parameters) for more details about how parameters are sent to the bot.

* * *

## [Parameter Control Definition](https://creator.poe.com/docs/server-bots/parameter-controls\#parameter-control-definition)

To define your parameter controls, you will create a JSON object that describes the desired UI and the corresponding parameters that the bot can accept as user input.

The are four basic building blocks:

- [Controls](https://creator.poe.com/docs/server-bots/parameter-controls#controls)
- [Parameters](https://creator.poe.com/docs/server-bots/parameter-controls#parameters)
- [Sections](https://creator.poe.com/docs/server-bots/parameter-controls#sections)
- [Tabs](https://creator.poe.com/docs/server-bots/parameter-controls#tabs)

* * *

## [Controls](https://creator.poe.com/docs/server-bots/parameter-controls\#controls)

The base building block is the Control. Controls describe individual UI elements that accept user input; like everything in the Parameter Controls API, they are described by JSON objects.

The basic available Controls are:

| **Control** | **Description** |
| --- | --- |
| [Divider](https://creator.poe.com/docs/server-bots/parameter-controls#divider) | Visual separator for grouping controls |
| [Text Field](https://creator.poe.com/docs/server-bots/parameter-controls#text-field) | Single-line input for short text |
| [Text Area](https://creator.poe.com/docs/server-bots/parameter-controls#text-area) | Multi-line input for longer text |
| [Drop Down](https://creator.poe.com/docs/server-bots/parameter-controls#drop-down) | Selection from predefined options |
| [Toggle Switch](https://creator.poe.com/docs/server-bots/parameter-controls#toggle-switch) | On/off control for boolean settings |
| [Slider](https://creator.poe.com/docs/server-bots/parameter-controls#slider) | Numeric value selector with range limits |
| [Condition](https://creator.poe.com/docs/server-bots/parameter-controls#conditional) | Shows/hides controls based on parameter values |

Other use-case-specific Controls are available:

| **Control** | **Description** |
| --- | --- |
| [Aspect Ratio](https://creator.poe.com/docs/server-bots/parameter-controls#aspect-ratio) | Selection for image/video dimensions with visual previews |

* * *

## [Parameters](https://creator.poe.com/docs/server-bots/parameter-controls\#parameters)

Parameters store the user input captured by Controls. Every Control has an associated Parameter, and the name of this Parameter is specified using the `parameter_name` property on the JSON description of the Control.

Controls may optionally specify a default value to store in their associated Parameter. If a default value is not provided, a default value will be inferred. Multiple controls are allowed to share the same `parameter_name`, but if they do they must all use the same default value.

When a user submits a message, their configured parameters are included in the ProtocolMessage object like this:

```
{
    "some_text_parameter": "some value",
    "some_number_paramter": 123, //some value
}
```

This lets your bot easily access both the message content and parameter values in a structured way.

Some things to consider:

- Parameters included in the parameter dictionary on ProtocolMessages do not have to come from the Poe UI.
- Bots calling other Bots through the Bot Query API can include arbitrary parameters in the parameter dictionary.
- The parameter dictionary might include parameters not defined in your parameter\_controls setting.
- Parameters included in the parameter dictionary can have any type and might have unexpected values.

### [Parameter Naming](https://creator.poe.com/docs/server-bots/parameter-controls\#parameter-naming)

- Only alphanumeric characters and underscores (\_) are allowed
- Parameters cannot contain hyphens (-)
- Parameters cannot start with "poe\_" as this prefix is reserved
- Style suggestions:
  - Parameter names should be descriptive and indicate their purpose
  - Use lowercase letters and underscores for readability (e.g., image\_size, output\_format)

Examples of valid parameter names:

```
user_preference
imageSize
quality_level
output_format_1
```

Examples of invalid parameter names:

```
poe_setting      // Starts with reserved prefix
image-size      // Contains hyphen
$special        // Contains special character
```

* * *

## [Sections](https://creator.poe.com/docs/server-bots/parameter-controls\#sections)

Sections group Tabs and Controls into collapsible accordion cards for visual organization. This grouping helps users by clustering controls that are related or manage specific aspects of your bot.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `name` | String | The name of the section shown in the header | No |
| `controls` | Array | List of Controls to show in this section | No |
| `tabs` | Array | List of Tabs to show in this section | No |
| `collapsed_by_default` | Boolean | Whether the section should start collapsed | No |

**Example**

```
{
  "name": "Image Generation",
  "controls": [\
    {\
      "control": "slider",\
      "label": "Image Width",\
      "parameter_name": "width",\
      "min_value": 256,\
      "max_value": 1024,\
      "step": 64\
    }\
  ],
  "collapsed_by_default": false
}
```

_Note: A section must contain either controls or tabs, but cannot contain both. At least one of these fields must be present._

* * *

## [Tabs](https://creator.poe.com/docs/server-bots/parameter-controls\#tabs)

Tabs group Controls together and live under Sections. They provide a convenient way to organize a long list of controls when you don't want to display them all simultaneously.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `name` | String | The name of the tab shown in the header | Yes |
| `controls` | Array | List of Controls to show in this tab | Yes |

**Example**

```
{
  "name": "Advanced Settings",
  "controls": [\
    {\
      "control": "slider",\
      "label": "Quality",\
      "parameter_name": "quality",\
      "min_value": 1,\
      "max_value": 10,\
      "step": 1,\
      "default_value": 5\
    },\
    {\
      "control": "toggle_switch",\
      "label": "High Resolution Mode",\
      "parameter_name": "high_res",\
      "default_value": false\
    }\
  ]
}
```

Tabs must contain at least one control. They provide a way to organize related controls into separate views that users can switch between.

* * *

## [Control Reference](https://creator.poe.com/docs/server-bots/parameter-controls\#control-reference)

### [Divider](https://creator.poe.com/docs/server-bots/parameter-controls\#divider)

You can use dividers to visually group or separate controls in ways that are intuitive for users.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a divider, control is always "divider" | Yes |

**Example**

```
{
  "control": "divider"
}
```

* * *

### [Text Field](https://creator.poe.com/docs/server-bots/parameter-controls\#text-field)

Text fields allow users to enter short text values. They are best suited for single-line inputs like names, keywords, or short commands.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a text field, control is always "text\_field" | Yes |
| `label` | String | The label text shown above the input field | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the input value | Yes |
| `default_value` | String | Optional default text for the input field | No |
| `placeholder` | String | Optional placeholder text shown when field is empty | No |

**Example**

```
{
  "control": "text_field",
  "label": "Style prompt",
  "description": "Define the visual style for your generated media",
  "parameter_name": "style_prompt",
  "default_value": "",
  "placeholder": "Photorealistic, anime, oil painting, cyberpunk"
}
```

* * *

### [Text Area](https://creator.poe.com/docs/server-bots/parameter-controls\#text-area)

Text areas allow users to enter longer text content. They are best suited for multi-line inputs like descriptions, prompts, or detailed instructions.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a text area, control is always "text\_area" | Yes |
| `label` | String | The label text shown above the text area | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the input value | Yes |
| `default_value` | String | Optional default text for the text area | No |
| `placeholder` | String | Optional placeholder text shown when field is empty | No |

**Example**

```
{
  "control": "text_area",
  "label": "Negative prompt",
  "description": "Enter content you want to exclude from generation",
  "parameter_name": "negative_prompt",
  "default_value": "",
  "placeholder": "Low quality, blurry, distorted"
}
```

* * *

### [Drop Down](https://creator.poe.com/docs/server-bots/parameter-controls\#drop-down)

Dropdowns allow users to select from a predefined list of options. They are ideal for scenarios where users need to choose one option from a limited set of choices.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a dropdown, control is always "drop\_down" | Yes |
| `label` | String | The label text shown above the dropdown | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the selected value | Yes |
| `default_value` | String | Optional default selected value | No |
| `options` | Array | List of Options, which are value-name pairs representing the available options | Yes |

**Option fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `value` | String | The internal value that will be stored in the parameter | Yes |
| `name` | String | The display text shown to users in the dropdown menu | Yes |

Each option in the options array must be an object containing both a value and name. The value is what gets stored in the parameter and used by your bot's logic, while the name is what's displayed to users in the UI.

**Example**

```
{
  "control": "drop_down",
  "label": "Model",
  "description": "Select your preferred AI model",
  "parameter_name": "model",
  "default_value": "gpt4o",
  "options": [\
    {"value": "gpt4o", "name": "GPT-4o"},\
    {"value": "claude4", "name": "Claude 4"},\
    {"value": "llama4", "name": "Llama 4"}\
  ]
}
```

* * *

### [Toggle Switch](https://creator.poe.com/docs/server-bots/parameter-controls\#toggle-switch)

Toggle switches allow users to turn options on or off. They are ideal for boolean settings or enabling/disabling features.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a toggle switch, control is always "toggle\_switch" | Yes |
| `label` | String | The label text shown next to the toggle switch | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the boolean value | Yes |
| `default_value` | Boolean | Optional default state of the toggle (true/false) | No |

**Example**

```
{
  "control": "toggle_switch",
  "label": "Enable creative mode",
  "description": "Generate more imaginative and diverse AI responses",
  "parameter_name": "creative_mode_enabled",
  "default_value": true
}
```

* * *

### [Slider](https://creator.poe.com/docs/server-bots/parameter-controls\#slider)

Sliders allow users to select a numeric value within a specified range. They are ideal for settings that require numerical input within defined boundaries.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a slider, control is always "slider" | Yes |
| `label` | String | The label text shown above the slider | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the numeric value | Yes |
| `default_value` | Number | Optional default position of the slider | No |
| `min_value` | Number | Minimum value of the slider range | Yes |
| `max_value` | Number | Maximum value of the slider range | Yes |
| `step` | Number | Increment between values on the slider | Yes |

**Example**

```
{
  "control": "slider",
  "label": "Thinking budget",
  "description": "Select the complexity level for your AI's reasoning",
  "parameter_name": "thinking_budget",
  "default_value": 50,
  "min_value": 10,
  "max_value": 100,
  "step": 5
}
```

* * *

### [Conditional](https://creator.poe.com/docs/server-bots/parameter-controls\#conditional)

Conditionals are control wrappers that dynamically hide or show other Controls based on parameter values.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For a conditional, control is always "condition" | Yes |
| `condition` | Object | Contains the comparison logic (ComparatorCondition) | Yes |
| `controls` | Array | List of controls to show/hide based on the condition | Yes |

**Condition**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `comparator` | String | The type of comparison. Currently only "equals" is supported | Yes |
| `left` | Object | Left side of comparison (LiteralValue or ParameterValue) | Yes |
| `right` | Object | Right side of comparison (LiteralValue or ParameterValue) | Yes |

**Parameter Value**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `parameter_name` | String | Name of the parameter whose value to use | Yes |

**Literal Value**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `literal` | String, Number, or Boolean | The literal value to use in the comparison | Yes |

**Example**

```
{
  "control": "condition",
  "condition": {
    "comparator": "equals",
    "left": {
      "parameter_name": "output_type"
    },
    "right": {
      "literal": "image"
    }
  },
  "controls": [\
    {\
      "control": "slider",\
      "label": "Image Width",\
      "parameter_name": "width",\
      "min_value": 256,\
      "max_value": 1024,\
      "step": 64,\
      "default_value": 512\
    }\
  ]
}
```

In this example, the slider control for image width is only shown when the output\_type parameter equals "image". The condition can compare either literal values or parameter values on both sides of the comparison.

* * *

### [Aspect Ratio](https://creator.poe.com/docs/server-bots/parameter-controls\#aspect-ratio)

The aspect ratio control lets users choose from predefined aspect ratios with visual previews for easy comparison—especially useful for image and video generation bots.

**Fields**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `control` | String | The type of control. For aspect ratio, control is always "aspect\_ratio" | Yes |
| `label` | String | The label text shown above the aspect ratio selector | Yes |
| `description` | String | Optional description text shown below the label | No |
| `parameter_name` | String | Name of the parameter to store the selected aspect ratio | Yes |
| `default_value` | String | Optional default selected aspect ratio | No |
| `options` | Array | List of AspectRatioOptionDefinition objects representing the available options | Yes |

**AspectRatioOptionDefinition**

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `width` | Number | The width value for the aspect ratio | Yes |
| `height` | Number | The height value for the aspect ratio | Yes |
| `value` | String | The value to be passed when the option is selected. If not defined, a string with the following format will be passed as the value: `[width]:[height]` (e.g. "16:9") | No |

**Example**

```
{
  "control": "aspect_ratio",
  "label": "Aspect ratio",
  "description": "Select the aspect ratio for your generated image",
  "parameter_name": "aspect_ratio",
  "default_value": "square",
  "options": [\
    {"value": "square", "width": 1, "height": 1},\
    {"value": "landscape", "width": 16, "height": 9},\
    {"value": "portrait", "width": 9, "height": 16}\
  ]
}
```

The aspect ratio control will display a visual preview of each ratio option to help users understand the proportions they're selecting.

On this page

[Adding Parameter Controls to Your Bot](https://creator.poe.com/docs/server-bots/parameter-controls#adding-parameter-controls-to-your-bot) [Getting Parameter Values from User Messages](https://creator.poe.com/docs/server-bots/parameter-controls#getting-parameter-values-from-user-messages) [Parameter Control Definition](https://creator.poe.com/docs/server-bots/parameter-controls#parameter-control-definition) [Controls](https://creator.poe.com/docs/server-bots/parameter-controls#controls) [Parameters](https://creator.poe.com/docs/server-bots/parameter-controls#parameters) [Parameter Naming](https://creator.poe.com/docs/server-bots/parameter-controls#parameter-naming) [Sections](https://creator.poe.com/docs/server-bots/parameter-controls#sections) [Tabs](https://creator.poe.com/docs/server-bots/parameter-controls#tabs) [Control Reference](https://creator.poe.com/docs/server-bots/parameter-controls#control-reference) [Divider](https://creator.poe.com/docs/server-bots/parameter-controls#divider) [Text Field](https://creator.poe.com/docs/server-bots/parameter-controls#text-field) [Text Area](https://creator.poe.com/docs/server-bots/parameter-controls#text-area) [Drop Down](https://creator.poe.com/docs/server-bots/parameter-controls#drop-down) [Toggle Switch](https://creator.poe.com/docs/server-bots/parameter-controls#toggle-switch) [Slider](https://creator.poe.com/docs/server-bots/parameter-controls#slider) [Conditional](https://creator.poe.com/docs/server-bots/parameter-controls#conditional) [Aspect Ratio](https://creator.poe.com/docs/server-bots/parameter-controls#aspect-ratio)