
var vscode = require( 'vscode' );

var clipboard;
var previousClipboard;

var debugEnabled = true;

function activate( context )
{
    function debug( text )
    {
        if( debugEnabled )
        {
            console.log( text );
        }
    }

    debug( "Swap and Paste activated" );

    function currentSelection()
    {
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        return editor.document.getText( new vscode.Range( s, e ) );
    }

    function copyToClipboard()
    {
        debug( "Swap and Paste: copyToClipboard()" );
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        if( hasSelection && editor.selections.length === 1 )
        {
            previousClipboard = clipboard;
            clipboard = editor.document.getText( new vscode.Range( s, e ) );
            debug( "Swap and Paste: clipboard: " + clipboard );
            debug( "Swap and Paste: previousClipboard: " + previousClipboard );
        }
    }

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.paste', function()
    {
        debug( "swap-and-paste.paste()" );

        var pasteCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).pasteCommand;
        var copyCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).copyCommand;

        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        if( hasSelection && editor.selections.length === 1 )
        {
            var currentClipboard = clipboard;
            var retain = vscode.workspace.getConfiguration( 'swap-and-paste' ).retainThroughDuplicateSelections;

            if( currentSelection() !== clipboard || retain === false )
            {
                copyToClipboard();
            }
            else
            {
                debug( "Swap and Paste: Using previous clipboard: " + previousClipboard );
                currentClipboard = previousClipboard;
            }

            debug( "Swap and Paste: " + copyCommand );
            vscode.commands.executeCommand( copyCommand ).then( function()
            {
                editor.edit( function( editBuilder )
                {
                    debug( "Swap and Paste: inserting " + currentClipboard );
                    editBuilder.replace( editor.selection, currentClipboard );
                }, { undoStopAfter: false, undoStopBefore: false } );
            } );
        }
        else
        {
            debug( "Swap and Paste: " + pasteCommand );
            vscode.commands.executeCommand( pasteCommand );
        }
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.copy', function()
    {
        debug( "swap-and-paste.copy()" );
        copyToClipboard();
        var copyCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).copyCommand;
        debug( "Swap and Paste: " + copyCommand );
        vscode.commands.executeCommand( copyCommand );
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.cut', function()
    {
        debug( "swap-and-paste.cut()" );
        copyToClipboard();
        var cutCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).cutCommand;
        debug( "Swap and Paste: " + cutCommand );
        vscode.commands.executeCommand( cutCommand );
    } ) );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
