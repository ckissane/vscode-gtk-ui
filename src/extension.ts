import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
// import * as fse from 'fs-extra';

interface FolderMap { [key: string]: string; }

interface Contribution {
	folderMap: FolderMap;
	browserModules: Array<string>;
	mainProcessModules: Array<string>;
}

interface API {
	contribute(sourceExtensionId: string, contribution: Contribution): void;
	active(): boolean;
}

function mkdirRecursive(p: string) {
	if (!fs.existsSync(p)) {
		if (path.parse(p).root !== p) {
			let parent = path.join(p, "..");
			mkdirRecursive(parent);
		}
		fs.mkdirSync(p);
	}
}

class Extension {

	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('customizeUI.')) {
				this.configurationChanged(e);
			}
		}));

		this.coffee = new Coffee(context);
	}

	get sourcePath() {
		return path.join(this.context.extensionPath, "modules");
	}

	get modulesPath() {
		return path.join(this.context.globalStoragePath, "modules");
	}


private copyFileSync( source:string, target:string ) {
	var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
	let src = source;//path.join(this.sourcePath, name);
	let dst = targetFile;//path.join(this.modulesPath, name);

	let data = fs.readFileSync(src);

	if (fs.existsSync(dst)) {
		let current = fs.readFileSync(dst);
		if (current.compare(data) === 0) {
			return false;
		}
	}
	fs.writeFileSync(dst, data);
	return true;
    

    // fs.writeFileSync(targetFile, fs.readFileSync(source));
}

private copyFolderRecursiveSync( source:string, target:string ) {
    var files = [];
	let didn=false;
    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
		didn=true;
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( ( file ) =>{
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
				didn=this.copyFolderRecursiveSync( curSource, targetFolder )||didn;
            } else {
                didn=this.copyFileSync( curSource, targetFolder )||didn;
            }
        } );
    }
	return didn;
}

	private copyModule(name: string) {

		let src = path.join(this.sourcePath, name);
		let dst = path.join(this.modulesPath, name);

		let data = fs.readFileSync(src);

		if (fs.existsSync(dst)) {
			let current = fs.readFileSync(dst);
			if (current.compare(data) === 0) {
				return false;
			}
		}
		fs.writeFileSync(dst, data);
		return true;
	}

	private copyModuleFolder(name: string) {

		let src = path.join(this.sourcePath, name);
		let dst = this.modulesPath;//path.join(this.modulesPath, name);
		return this.copyFolderRecursiveSync(src, dst);
		// fse.copySync(src, dst,{overwrite: true});
	
		// return true;
	}

	private get haveBottomActivityBar() {
		return vscode.workspace.getConfiguration().get("customizeUI.activityBar") === "bottom";
	}

	private get haveInlineTitleBar() {
		return vscode.workspace.getConfiguration().get("customizeUI.titleBar") === "inline";
	}

	private get haveFontCustomizations() {
		return vscode.workspace.getConfiguration().get("customizeUI.fontSizeMap") !== undefined &&
			vscode.workspace.getConfiguration().get("customizeUI.font.regular") !== undefined ||
			vscode.workspace.getConfiguration().get("customizeUI.font.monospace") !== undefined;
	}

	private get haveStylesheetCustomizations() {
		return vscode.workspace.getConfiguration().get("customizeUI.stylesheet") !== undefined;
	}

	async start() {

		let freshStart = !fs.existsSync(this.modulesPath);
		mkdirRecursive(this.modulesPath);

		// copy the modules to global storage path, which unlike extension path is not versioned
		// and will work after update

		let browser = [
			this.copyModule("vscode-gtk-ui.css"),
			this.copyModule("activity-bar.js"),
			this.copyModule("vscode-gtk-ui.js"),
			this.copyModule("fonts.js"),
			this.copyModule("title-bar.js")
			,
			this.copyModuleFolder("electron-gtk-theme"),
			this.copyModuleFolder("../node_modules")
		];

		let mainProcess = [
			this.copyModule("title-bar-main-process.js"),
			this.copyModule("utils.js"),
		];

		let updatedBrowser = browser.includes(true);
		let updatedMainProcess = mainProcess.includes(true);

		if (!freshStart && (
			this.haveBottomActivityBar ||
			this.haveInlineTitleBar ||
			this.haveFontCustomizations ||
			this.haveStylesheetCustomizations)) {
			if (updatedMainProcess) {
				let res = await vscode.window.showInformationMessage("GTK UI extension was updated. Your VSCode instance needs to be restarted", "Restart");
				if (res === "Restart") {
					this.promptRestart();
				}
			}
			else if (updatedBrowser) {
				let res = await vscode.window.showInformationMessage("GTK UI extension was updated. Your VSCode window needs to be reloaded.", "Reload Window");
				if (res === "Reload Window") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			}
		}

		let monkeyPatch = vscode.extensions.getExtension("iocave.monkey-patch");

		if (monkeyPatch !== undefined) {
			await monkeyPatch.activate();
			let exports: API = monkeyPatch.exports;
			exports.contribute("ckissane.vscode-gtk-ui",
				{
					folderMap: {
						"vscode-gtk-ui": this.modulesPath,
						'gtk-node_modules':path.join(this.sourcePath,'..','node_modules')
					},
					browserModules: [
						"vscode-gtk-ui/vscode-gtk-ui"
					],
					mainProcessModules: [
						"vscode-gtk-ui/title-bar-main-process",
					]
				}
			);
		} else {
			vscode.window.showWarningMessage("Monkey Patch extension is not installed. GTK UI will not work.");
		}
	}

	private async promptRestart() {
		// This is a hacky way to display the restart prompt
		let v = vscode.workspace.getConfiguration().inspect("window.titleBarStyle");
		if (v !== undefined) {
			let value = vscode.workspace.getConfiguration().get("window.titleBarStyle");
			await vscode.workspace.getConfiguration().update("window.titleBarStyle", value === "native" ? "custom" : "native", vscode.ConfigurationTarget.Global);
			vscode.workspace.getConfiguration().update("window.titleBarStyle", v.globalValue, vscode.ConfigurationTarget.Global);
		}
	}

	async configurationChanged(e: vscode.ConfigurationChangeEvent) {
		let monkeyPatch = vscode.extensions.getExtension("iocave.monkey-patch");
		if (monkeyPatch !== undefined) {
			await monkeyPatch.activate();
			let exports: API = monkeyPatch.exports;
			if (!exports.active()) {
				let res = await vscode.window.showWarningMessage("Monkey Patch extension is not enabled. Please enable Monkey Patch in order to use GTK UI.", "Enable");
				if (res === "Enable") {
					vscode.commands.executeCommand("iocave.monkey-patch.enable");
				}
			} else {
				if (e.affectsConfiguration("customizeUI.titleBar")) {
					let enabled = this.haveInlineTitleBar;
					if (enabled) {
						let titleBarStyle = vscode.workspace.getConfiguration().get("window.titleBarStyle");
						if (titleBarStyle === "custom") {
							let res = await vscode.window.showWarningMessage("Inline title bar requires titleBarStyle = 'native'.", "Enable");
							if (res === "Enable") {
								await vscode.workspace.getConfiguration().update(
									"window.titleBarStyle", "native", vscode.ConfigurationTarget.Global,
								);
								return;
							}
						}
					}
					this.promptRestart();
				}
				let res = await vscode.window.showInformationMessage("Customizing UI requires window reload", "Reload Window");
				if (res === "Reload Window") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			}
		}
	}

	private context: vscode.ExtensionContext;
	private coffee: Coffee;
}

class Coffee {
	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		setTimeout(()=>this.check(), 1000);
		setInterval(()=>this.check(), 1000 * 3600);
	}

	check() : void
	{
		let snoozeUntil = this.context.globalState.get<number>("coffee-snooze-until");

		if (snoozeUntil === undefined || snoozeUntil < Date.now()) {
			this.show();
		}
	}

	private async show()
	{
		// let buttons = ["Buy me a coffee", "Maybe later", "Don't ask again"];
		// let b = await vscode.window.showInformationMessage(
		// 			"Hey! " +
		// 			"vscode gtk UI requires constant maintenance to keep up with vscode changes. " +
		// 			"If you like what it does, please consider buying me a coffee.",
		// 			...buttons);
		// if (b === buttons[0]) {
		// 	vscode.env.openExternal(vscode.Uri.parse("https://www.buymeacoffee.com/ckissane"));
		// 	this.snooze(90);
		// }
		// else if (b === buttons[1]) {
		// 	this.snooze(7);
		// }
		// else if (b === buttons[2]) {
		// 	// maybe change mind in ten years :)
		// 	this.snooze(365 * 10);
		// }
	}

	private snooze(days: number) {
		let until = Date.now() + days * 24 * 60 * 60 * 1000;
		console.log(`Snoozing until ${new Date(until).toString()}`);
		this.context.globalState.update("coffee-snooze-until", until);
	}

	private context: vscode.ExtensionContext;
}

export function activate(context: vscode.ExtensionContext) {
	new Extension(context).start();
}

// this method is called when your extension is deactivated
export function deactivate() { }
