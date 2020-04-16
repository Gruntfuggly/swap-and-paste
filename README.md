# Swap and Paste

Sometimes it's useful to be able two swap two pieces of code. This extension automatically copies anything selected when pasting and inserts it in the paste buffer.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.swap-and-paste).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install swap-and-paste

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/swap-and-paste).

## Configuration

`swap-and-paste.pasteCommand`

If there is no selection when pasting, this command is executed instead. This allows you to use an alternative clipboard extension if required. Defaults to the standard `editor.action.clipboardPasteAction`.

`swap-and-paste.cutCommand`

When cutting the selected text, use this command. Defaults to the standard `editor.action.clipboardCutAction`.

## Credits

Icon made by [Freepik](https://www.flaticon.com/authors/freepik) from <www.flaticon.com>.
