# GTK UI README

This experimental extension allows customizing VSCode user interface beyond what's normally possible, such as

- (ON LINUX) Custom stylesheet that syncs with GTK 3.0 theme


## Supported configuration options

### `customizeUI.activityBar`

When set to `top`, activity bar will be positioned over the sidebar.

When set to `bottom`, activity bar will be positioned below the sidebar.

When set to `wide`, activity bar will match the width of traffic lights (for macOS inline menu bar).

### `customizeUI.moveStatusbar`

When enabled move the statusbar below the panel (Terminal, Output, Problems). Useful to gain some space for the sidebar.

**WARNING:** don't works well if panel is set to left or right,  
this setting was added to be able to disable the default behavior.

### `customizeUI.activityBarHideSettings`

When enabled hides the Settings (and Accounts) icon in horizontal (`bottom`) activity bar. Useful when the activity bar gets too crowded.

### `customizeUI.titleBar`

macOS only. Setting this hides the titlebar, and the tab bar becomes draggable.

* `inline`: places window controls in the sidebar or tab bar.

* `frameless`: hides window controls.

Note that this setting requires that `"window.titleBarStyle": "native"` is also set.


### `customizeUI.fontSizeMap`

Mapping from hardcoded VSCode font size to custom font size. For example the following will change 13px and 12px UI fonts to 11px, which fixes huge sidebar font on OS X.

```jsonc
    "customizeUI.fontSizeMap": {
        "13px": "11px",
        "12px": "11px",
        "window-title": "12px", // Window title font when using custom titlebar
        "tab-title": "12px",    // Used for editor tab titles
        "monospace": "10.5px",  // Used for monospace fonts in user interface
        "menu": "13px",         // Used for menu items (windows only)
    }
```

### `customizeUI.listRowHeight`

Changes row height in various list and trees in user inteface. 22 by default

```jsonc
    "customizeUI.listRowHeight": 20, // shrink rows to match XCode
```

### `customizeUI.font.regular` and `customizeUI.font.monospace`

Allows changing font face for regular and monospace user interface fonts

```jsonc
    "customizeUI.font.regular": "Helvetica Nueve",
    "customizeUI.font.monospace": "Fira Code",
```

### `customizeUI.stylesheet`

Allow adding custom stylesheet rules. It is in form of a map where selectors are keys.

```jsonc
    "customizeUI.stylesheet": {
        ".search-view .search-widgets-container": "padding-top: 0px !important",
        ".suggest-input-container": "padding: 3px 4px 3px !important;"
    }
```

## How does it work

GTK UI relies on the [Monkey Patch Extension](https://marketplace.visualstudio.com/items?itemName=iocave.monkey-patch) to inject custom javascript in VSCode. After installation you should
be prompted to enable Monkey Patch. You can always trigger this manually by invoking the "Enable Monkey Patch" command.

## Credits

Based off Customize UI.

## Coffee

If you like this this extension, consider [buying me a coffee](https://www.buymeacoffee.com/ckissane). Thank you!

