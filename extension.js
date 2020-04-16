
var vscode = require( 'vscode' );

function activate( context )
{
    var disposable = vscode.commands.registerCommand( 'swap-and-paste.paste', function()
    {
        var pasteCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).pasteCommand;
        var cutCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).cutCommand;

        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;
        var r = selection.isReversed;

        var originalStartOffset = editor.document.offsetAt( s );
        var originalEndOffset = editor.document.offsetAt( e );

        var hasSelection = s.line !== e.line || s.character !== e.character;

        if( hasSelection && editor.selections.length === 1 )
        {
            editor.selection = new vscode.Selection( s, s );

            vscode.commands.executeCommand( pasteCommand ).then( function()
            {
                var offset = editor.document.offsetAt( editor.selection.end ) - originalStartOffset;
                editor.selection = new vscode.Selection( editor.document.positionAt( originalStartOffset + offset ), editor.document.positionAt( originalEndOffset + offset ) );

                vscode.commands.executeCommand( cutCommand );
            } );
        }
        else
        {
            vscode.commands.executeCommand( pasteCommand );
        }
    } );

    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
