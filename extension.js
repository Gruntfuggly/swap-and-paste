
var vscode = require( 'vscode' );

var clipboard;
var previousClipboard;

function activate( context )
{
    var outputChannel;

    function debug( text )
    {
        if( outputChannel )
        {
            outputChannel.appendLine( text );
        }
    }

    function resetOutputChannel()
    {
        if( outputChannel )
        {
            outputChannel.dispose();
            outputChannel = undefined;
        }
        if( vscode.workspace.getConfiguration( 'swap-and-paste' ).debug === true )
        {
            outputChannel = vscode.window.createOutputChannel( "Swap and Paste" );
        }
    }

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
        debug( "swap-and-paste.copyToClipboard()" );
        var editor = vscode.window.activeTextEditor;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        if( hasSelection && editor.selections.length === 1 )
        {
            previousClipboard = clipboard;
            clipboard = editor.document.getText( new vscode.Range( s, e ) );
        }
    }

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.paste', function()
    {
        debug( "swap-and-paste.paste()" );

        vscode.env.clipboard.readText().then( function( systemClipboard )
        {
            var pasteCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).pasteCommand;
            var copyCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).copyCommand;

            if( clipboard === systemClipboard )
            {
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
                        debug( "Using previous clipboard: " + previousClipboard );
                        currentClipboard = previousClipboard;
                    }

                    debug( copyCommand );
                    vscode.commands.executeCommand( copyCommand ).then( function()
                    {
                        editor.edit( function( editBuilder )
                        {
                            debug( "Inserting: " + currentClipboard );
                            editBuilder.replace( editor.selection, currentClipboard );
                        }, { undoStopAfter: false, undoStopBefore: false } );
                    } );
                }
                else
                {
                    debug( pasteCommand );
                    vscode.commands.executeCommand( pasteCommand );
                }
            }
            else
            {
                debug( "Using external clipboard content" );
                debug( pasteCommand );
                vscode.commands.executeCommand( pasteCommand );
            }
        } );
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.copy', function()
    {
        debug( "swap-and-paste.copy()" );
        copyToClipboard();
        var copyCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).copyCommand;
        debug( copyCommand );
        vscode.commands.executeCommand( copyCommand );
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'swap-and-paste.cut', function()
    {
        debug( "swap-and-paste.cut()" );
        copyToClipboard();
        var cutCommand = vscode.workspace.getConfiguration( 'swap-and-paste' ).cutCommand;
        debug( cutCommand );
        vscode.commands.executeCommand( cutCommand );
    } ) );


    context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
    {
        if( e.affectsConfiguration( "swap-and-paste.debug" ) )
        {
            resetOutputChannel();
        }
    } ) );

    resetOutputChannel();

    debug( "Swap and Paste activated" );
}

exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
