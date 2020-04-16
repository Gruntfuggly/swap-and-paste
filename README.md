# Swap and Paste

Sometimes it's useful to be able to swap two pieces of code. This extension simply copies anything selected when pasting and inserts it in the paste buffer. *Note: Only works with single selections - multiple selections would get too complicated!*

Overrides the default cut, copy and paste key bindings. If you want to use in conjunction with another clipboard extension, set the appropriate commands as per the configuration below.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.swap-and-paste).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install swap-and-paste

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/swap-and-paste).

## Configuration

`swap-and-paste.pasteCommand`

If there is no selection when pasting, this command is executed instead. This allows you to use an alternative clipboard extension if required. Defaults to the standard `editor.action.clipboardPasteAction`.

`swap-and-paste.copyCommand`

When copying the selected text, the extension will call this command after copying the selection to it's own clipboard. Defaults to the standard `editor.action.clipboardCopyAction`.

`swap-and-paste.cutCommand`

When cutting the selected text, the extension will call this command after copying the selection to it's own clipboard. Defaults to the standard `editor.action.clipboardCutAction`.

## Credits

Icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com)
