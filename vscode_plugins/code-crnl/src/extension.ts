// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-crnl" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-crnl.python_run', () => {
		// The code you place here will be executed every time your command is executed

		// Create a new terminal window
		let terminal = vscode.window.createTerminal();

		// Show the new terminal window on front-end
		terminal.show();
		
		// Run the command on the new terminal
		let currentWorkspace = vscode.workspace.name;
		let currentWorkspacePath = vscode.workspace.rootPath;
		let currentProgram = vscode.window.activeTextEditor?.document.fileName;
		let previousLogsPath = currentWorkspacePath + '\\previous_logs.txt';

		console.log(currentProgram);

		let logFilePath = currentWorkspacePath + '\\out_log.txt';
		
		console.log(logFilePath);

		if (fs.existsSync(logFilePath)) {
			var logs = fs.readFileSync(logFilePath);
			
			fs.appendFileSync(previousLogsPath, logs);
			fs.rmdir(logFilePath, (err) => {console.log(err)});
		}
		
		
		let command = 'python ' + currentProgram + ' 2>&1 | tee out_log.txt';
		terminal.sendText(command);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
