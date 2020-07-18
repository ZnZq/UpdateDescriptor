const vscode = require('vscode');
const fs = require('fs');
const path = require("path");

function activate() {
	vscode.workspace.onDidSaveTextDocument(function (document) {
		if ((document.languageId === "javascript" || document.languageId === "csharp") &&
			document.uri.scheme === "file") {
			let filePath = path.dirname(document.fileName);
			let descriptorFile = path.join(filePath, "descriptor.json");
			fs.exists(descriptorFile, function (exist) {
				if (exist) {
					fs.readFile(descriptorFile, function (error, data) {
						if (error) {
							vscode.window.showErrorMessage(error.toString());
							return;
						}
						try {
							var json = JSON.parse(data.toString('utf8').trim());

							let time = new Date().getTime();
							json.Descriptor.ModifiedOnUtc = `\\/Date(${time})\\/`;
							json = JSON.stringify(json, null, '  ').replace(/\\\\/g, '\\');

							fs.writeFile(descriptorFile, json, function (error) {
								if (error) {
									vscode.window.showErrorMessage(error.toString());
								} else {
									console.log(`File "${descriptorFile}" updated!`);
								}
							});
						} catch (e) {
							vscode.window.showErrorMessage(e.toString());
						}
					});
				}
			});
		}
	});
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}