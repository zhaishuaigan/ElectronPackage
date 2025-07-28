module.exports = {
    openFile: async (options = {}) => {
        const { dialog } = require('electron');
        const { canceled, filePaths } = await dialog.showOpenDialog(options);
        if (!canceled) {
            return filePaths[0];
        }
        return null;
    },
    rename: async (path, name) => {
        const fs = require('fs');
        await fs.promises.rename(path, name);
        return true;
    },
    deleteFile: async (path) => {
        const fs = require('fs');
        await fs.promises.unlink(path);
        return true;
    },
    copy: async (path, newPath, options = {}) => {
        var fs = require('fs');
        await fs.promises.cp(path, newPath, options);
        return true;
    },
    openDir: async () => {
        const { dialog } = require('electron');
        console.log('dialog', dialog);
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (!canceled) {
            console.log(filePaths[0]);
            return filePaths[0];
        }
        return null;
    },
    readFile: (name) => {
        const fs = require('fs');
        if (!fs.existsSync(name)) {
            return null;
        }
        return fs.readFileSync(name).toString();
    },
    hasFile: (name) => {
        const fs = require('fs');
        return fs.existsSync(name);
    },
    readJSON: (name) => {
        const fs = require('fs');
        if (!fs.existsSync(name)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(name).toString());
    },
    writeFile: (name, content) => {
        const fs = require('fs');
        fs.writeFileSync(name, content);
        return true;
    },

    copyElectronTo: async (output) => {
        var fs = require('fs');
        var path = require('path');
        var current = path.dirname(global.app.getPath('exe'));
        await fs.promises.cp(current, output, {
            recursive: true,
            filter: (src, dest) => {
                var filename = src.replace(current, '');
                if (filename.includes(output)) {
                    return false;
                }

                if (filename.includes('LICENSES.chromium.html')) {
                    return false;
                }

                if (filename.includes('electron-v37.2.1-win32-x64.zip')) {
                    return false;
                }

                if (filename.includes('resources\\')) {
                    return false;
                }
                console.log('正在复制文件: ', src);
                return true;
            }
        });
        return true;
    },

    copyProjectCode: async (project, output) => {
        var fs = require('fs');
        await fs.promises.cp(project, output, {
            recursive: true,
            filter: (src, dest) => {
                if (src.includes('node_modules')) {
                    return false;
                }

                if (src.includes('.git')) {
                    return false;
                }
                console.log('正在复制文件: ', src);
                return true;
            }
        });
        return true;
    },

    setIcon: async (filename, icon) => {
        return new Promise((resolve, reject) => {
            var path = require('path');
            const { exec } = require('node:child_process');
            var rcedit = path.join(__dirname, 'rcedit.exe');
            var commend = `"${rcedit}" "${filename}" --set-icon "${icon}"`;
            exec(commend, { cwd: process.resourcesPath }, (err, stdout, stderr) => {
                resolve('ok');
            });
        });

    },
};