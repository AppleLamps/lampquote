---
url: "https://creator.poe.com/docs/canvas-apps/canvas-limitations"
title: "Canvas Limitations | Poe Creator Platform"
---

# Canvas Limitations

Copy for LLMView as Markdown

## [Client only](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#client-only)

Canvas apps are single-file HTML applications. They cannot run server-side code. Apart from loading resources from CDNs (see _Fetching external resources_), they generally cannot connect to external servers.

## [No included database](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#no-included-database)

Canvas apps do not have an included way to persist data. This will change in the future. If you have your own server that can persist data, a canvas app can connect to it after disabling the CSP (see _Fetching external resources_). Alternatively, you can read/write data by sending messages to a server bot that you control.

## [Light/dark mode](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#lightdark-mode)

Light/dark mode always works on Chrome and Firefox. On Safari, the canvas app will inherit the light/dark mode setting of the operating system, not Poe.

On [poe.com/settings](http://poe.com/settings) there are 3 different color scheme options:

- Forced light mode
- Forced dark mode
- System (inherit color scheme of system)

This means if the user has selected _Forced light mode_, and the operating system is in dark mode, in Safari the Canvas embed will show up as dark mode.

## [Service Workers and Shared Workers](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#service-workers-and-shared-workers)

Service workers and Shared workers are not enabled.

## [Web Workers](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#web-workers)

Only web workers initialized using `blob://` or `data://` urls are enabled.

## [Webcam and microphone](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#webcam-and-microphone)

Webcam and microphone access is disabled for canvas apps.

## [Local storage](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#local-storage)

Browser local storage APIs are disabled for canvas apps.

## [Clipboard](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#clipboard)

Canvas apps can write to the clipboard, but cannot read from the clipboard.

## [History API](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#history-api)

Canvas apps cannot use the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API).

## [Links/navigation](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#linksnavigation)

Cross origin links (such as `<a href="https://www.google.com">`) will trigger a " _Do you want to open this url?"_ confirmation. If the user confirms, the link will open in a new tab ( [example](https://poe.com/ExampleWebsiteLink)).

Same origin links (such as `<a href="/about">`) are not possible in canvas embeds.

## [File downloads](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#file-downloads)

File download links are enabled.

Similar to standard HTML websites, a clickable download button can be created by rendering a link with the download attribute (`<a href="blob:..." download="My image">Download Image</a>`) ( [example](https://poe.com/withdownloadbutton)).

If the source of the file to be downloaded is not in the [trusted origins list](https://poe.com/canvas_csp), the download will trigger a “ _Do you want to open this url?”_ confirmation. If the user confirms, the url will be opened in a new tab.

## [Window APIs](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#window-apis)

Because the canvas iframe lacks the `allow-modals` permission, methods like `alert()`, `confirm()`, `print()`, and `prompt()` will not work. Calling these methods will result in an error message being logged to the browser console.

## [Fetching external resources](https://creator.poe.com/docs/canvas-apps/canvas-limitations\#fetching-external-resources)

Canvas apps can load libraries/resources from a set of trusted origins such as [cdnjs.cloudflare.com](http://cdnjs.cloudflare.com/) and [cdn.jsdelivr.net](http://cdn.jsdelivr.net/).

[View trusted origins](https://poe.com/canvas_csp)

Canvas apps have strict security restrictions that prevent them from connecting with untrusted origins. If the canvas app tries to load an untrusted resource, the _Allow untrusted external resources_ confirmation will show. If the user clicks _Allow all_, the canvas app will reload without the security restrictions, and will then be allowed to load any resource.

To avoid triggering the _Allow untrusted external resources_ confirmation, we recommended only loading JavaScript libraries or CSS frameworks from a trusted origin.

**Example:** [https://poe.com/CSPBannerExample](https://poe.com/CSPBannerExample)

![Canvas limitation example 1](https://files.readme.io/17529e6cbce70f378522bda6c625372e11dbf4bad141c23e26350b0d9c377258-image.png)![Canvas limitation example 2](https://files.readme.io/46e3944ee46576c947915885ec59728435981c4dad4918e2058b8fde4ec0f77b-image.png)

On this page

[Client only](https://creator.poe.com/docs/canvas-apps/canvas-limitations#client-only) [No included database](https://creator.poe.com/docs/canvas-apps/canvas-limitations#no-included-database) [Light/dark mode](https://creator.poe.com/docs/canvas-apps/canvas-limitations#lightdark-mode) [Service Workers and Shared Workers](https://creator.poe.com/docs/canvas-apps/canvas-limitations#service-workers-and-shared-workers) [Web Workers](https://creator.poe.com/docs/canvas-apps/canvas-limitations#web-workers) [Webcam and microphone](https://creator.poe.com/docs/canvas-apps/canvas-limitations#webcam-and-microphone) [Local storage](https://creator.poe.com/docs/canvas-apps/canvas-limitations#local-storage) [Clipboard](https://creator.poe.com/docs/canvas-apps/canvas-limitations#clipboard) [History API](https://creator.poe.com/docs/canvas-apps/canvas-limitations#history-api) [Links/navigation](https://creator.poe.com/docs/canvas-apps/canvas-limitations#linksnavigation) [File downloads](https://creator.poe.com/docs/canvas-apps/canvas-limitations#file-downloads) [Window APIs](https://creator.poe.com/docs/canvas-apps/canvas-limitations#window-apis) [Fetching external resources](https://creator.poe.com/docs/canvas-apps/canvas-limitations#fetching-external-resources)