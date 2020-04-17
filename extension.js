
var vscode = require( 'vscode' );

var clipboard;

function activate( context )
{
    console.log( "Swap and Paste activated" );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.paste', function()
    {
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
            copyToClipboard();

            console.log( "Swap and Paste: " + copyCommand );
            vscode.commands.executeCommand( copyCommand ).then( function()
            {
                editor.edit( function( editBuilder )
                {
                    console.log( "Swap and Paste: inserting " + currentClipboard );
                    editBuilder.replace( editor.selection, currentClipboard );
                }, { undoStopAfter: false, undoStopBefore: false } );
            } );
        }
        else
        {
            console.log( "Swap and Paste: " + pasteCommand );
            vscode.commands.executeCommand( pasteCommand );
        }
    } ) );

    function copyToClipboard()
    {
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        if( hasSelection && editor.selections.length === 1 )
        {
            clipboard = editor.document.getText( new vscode.Range( s, e ) );
            console.log( "Swap and Paste: clipboard: " + clipboard );
        }
    }

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.copy', function()
    {
        copyToClipboard();
        var copyCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).copyCommand;
        console.log( "Swap and Paste: " + copyCommand );
        vscode.commands.executeCommand( copyCommand );
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.cut', function()
    {
        copyToClipboard();
        var cutCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).cutCommand;
        console.log( "Swap and Paste: " + cutCommand );
        vscode.commands.executeCommand( cutCommand );
    } ) );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
