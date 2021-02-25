// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	context.subscriptions.push(vscode.commands.registerCommand('lighthouse.authenticate', () => {
		LighthouseAuthenticatePanel.createOrShow(context.extensionUri);
	}));

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(LighthouseAuthenticatePanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				LighthouseAuthenticatePanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

class LighthouseAuthenticatePanel {
	public static currentPanel: LighthouseAuthenticatePanel | undefined;

	public static readonly viewType = 'lighthouseAuthenticate';
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (LighthouseAuthenticatePanel.currentPanel) {
			LighthouseAuthenticatePanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			LighthouseAuthenticatePanel.viewType,
			'Lighthouse authenticate',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		LighthouseAuthenticatePanel.currentPanel = new LighthouseAuthenticatePanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		LighthouseAuthenticatePanel.currentPanel = new LighthouseAuthenticatePanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		
	}

	public dispose() {
		LighthouseAuthenticatePanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to lighthouse image to show in the webview
		const lighthouseImagePathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'lighthouse.svg');

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">


				<title>Lighthouse authenticate</title>
			</head>
			<body>
				<h1>Welcome to Lighthouse</h1>
				<img src="${lighthouseImagePathOnDisk.fsPath}" alt="Lighthouse" />
				<h3>Sign in to continue</h3>
				<div class="form-control">
				<label for="username">Username</label>
				<input id="usernameInput" type="text" />
				</div>
				<div class="form-control">
				<label for="password">Password</label>
				<input id="passwordInput" type="password" />
				</div>
				<button id="login_btn">Authenticate</button>

				
			</body>
			</html>`;
	}

}