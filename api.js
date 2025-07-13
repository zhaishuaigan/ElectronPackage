module.exports = {
    openFile: async () => {
        const { dialog } = require('electron');
        const { canceled, filePaths } = await dialog.showOpenDialog();
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
    downloadElectron: async (version) => {
        return new Promise(async (resolve, reject) => {
            const https = require('https');
            const fs = require('fs');
            var path = require('path');
            var cacheDir = path.dirname(process.execPath);
            console.log(cacheDir);
            var name = `electron-${version}-win32-x64.zip`;
            var filename = `${cacheDir}/${name}`;
            if (fs.existsSync(filename)) {
                resolve('ok');
                return;
            }
            var url = `https://cdn.npmmirror.com/binaries/electron/${version}/${name}`;
            console.log(url);
            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    const fileStream = fs.createWriteStream(filename);
                    response.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve('ok');
                    });
                } else {
                    resolve(`下载失败，状态码: ${response.statusCode}`);
                }
            }).on('error', (err) => {
                resolve(`请求错误: ${err.message}`);
            });

        });

    },

    unzipElectron: async (version, output) => {
        return new Promise(async (resolve, reject) => {
            try {
                process.noAsar = true;
                const DecompressZip = require('decompress-zip');
                var fs = require('fs');
                var path = require('path');
                var name = `electron-${version}-win32-x64.zip`;
                var cacheDir = path.dirname(process.execPath);
                var filename = path.join(cacheDir, name);
                await fs.promises.rmdir(output, { recursive: true });
                await fs.promises.mkdir(output);
                const unzipper = new DecompressZip(filename);
                unzipper.on('error', function (err) {
                    console.log('解压过程中发生错误:', err);
                    resolve('解压过程中发生错误:', err);
                });

                unzipper.on('extract', function (log) {
                    console.log('解压完成:', log);
                    process.noAsar = false;
                    resolve('ok');
                });
                unzipper.on('progress', function (fileIndex, fileCount) {
                    console.log(`已解压文件 ${fileIndex + 1} / ${fileCount}`);
                });
                unzipper.extract({
                    path: output
                });
            } catch (e) {
                process.noAsar = false;
                resolve('error: ' + e.message);
            }
        });

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

    asarPackage: async (project, output) => {
        var { createPackage } = require('@electron/asar');
        await createPackage(project, output);
        return 'ok';
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