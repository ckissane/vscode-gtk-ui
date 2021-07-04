# GTK UI README

This experimental extension allows customizing VSCode user interface beyond what's normally possible, such as

- (ON LINUX) Custom stylesheet that syncs with GTK 3.0 theme

# Instructions
 1. Install and activate the monkey patch vs code extension
 2. git clone this repo into your vscode extensions folder (`~/.vscode/extensions` on linux)
Example:
```bash
cd ~/.vscode/extensions
git clone https://github.com/ckissane/vscode-gtk-ui.git
```
3. Reload monkey patch configuration in vscode and restart vscode
4. profit


## How does it work

GTK UI relies on the [Monkey Patch Extension](https://marketplace.visualstudio.com/items?itemName=iocave.monkey-patch) to inject custom javascript in VSCode. After installation you should
be prompted to enable Monkey Patch. You can always trigger this manually by invoking the "Enable Monkey Patch" command.

## Credits

Based off Customize UI.

## Coffee

If you like this this extension, consider [buying me a coffee](https://www.buymeacoffee.com/ckissane). Thank you!

