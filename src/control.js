const vscode = require('vscode');
const fs = require('fs');

let fileEndName = [
    '.js',
    '.json',
    '.wxml',
    '.wxss'
]

const createPage = url => {
    vscode.window.showInputBox({
        placeHolder: "页面文件名称",
        prompt: "请输入页面文件名称"
    }).then( text => {
        fileEndName.forEach(item => {
            fs.access(`${url}/${text}${item}`, err => {
                if(!err){
                    vscode.window.showErrorMessage('此Page的部分或全部文件已存在');
                    return false;
                }
            });
        });
        fileEndName.forEach(item => {
            fs.writeFile(`${url}/${text}${item}`, "utf-8", () => {});
        });
    });
}

//命令数组
const commands = {
    create: {
        page: url => {
            if(!url){
                vscode.window.showInputBox({
                    placeHolder: "页面所在目录路径",
                    prompt: "请输入页面所在目录路径"
                }).then( text => {
                    createPage(text);
                });
            }else{
                createPage(url.fsPath);
            }
        }
    }
}

const control = {
    activate: context => {
        Object.keys(commands).map(name => {
            if(typeof commands[name] == "function"){
                context.subscriptions.push(vscode.commands.registerCommand(`minitool.${name}`, commands[name]));
            }else if(typeof commands[name] == "object"){
                Object.keys(commands[name]).map(key => {
                    context.subscriptions.push(vscode.commands.registerCommand(`minitool.${name}.${key}`, commands[name][key]));
                })
            }
        });
    }
}

module.exports = control