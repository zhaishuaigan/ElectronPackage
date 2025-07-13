<script>

export default {
    data() {
        return {
            projectDir: '',
            projectName: '',
            icon: '',
            outputDir: '',

            message: '',
            error: '',
            success: '',

            loading: false
        }
    },
    watch: {
        error: function (val) {
            if (val != '') {
                setTimeout(() => {
                    this.error = '';
                }, 10000);
            }
        },
        message: function (val) {
            if (val != '') {
                setTimeout(() => {
                    this.message = '';
                }, 10000);
            }
        },
    },
    mounted() {
        // window.width = 600;
        // window.height = 960;
        if (localStorage.getItem('projectDir')) {
            this.projectDir = localStorage.getItem('projectDir');
        }
        if (localStorage.getItem('projectName')) {
            this.projectName = localStorage.getItem('projectName');
        }
        if (localStorage.getItem('icon')) {
            this.icon = localStorage.getItem('icon');
        }
        if (localStorage.getItem('outputDir')) {
            this.outputDir = localStorage.getItem('outputDir');
        }



    },
    methods: {
        async openProjectDir() {
            this.projectDir = await api.openDir();
            localStorage.setItem('projectDir', this.projectDir);
        },
        async openIcon() {
            this.icon = await api.openFile();
            localStorage.setItem('icon', this.icon);
        },
        async openOutputDir() {
            this.outputDir = await api.openDir();
            localStorage.setItem('outputDir', this.outputDir);
        },
        async build() {
            this.error = "";
            this.message = '';
            if (!this.projectDir) {
                this.error = "请选择项目目录";
                this.loading = false;
                return;
            }
            if (!this.outputDir) {
                this.error = "请选择输出目录";
                this.loading = false;
                return;
            }

            localStorage.setItem('projectName', this.projectName);

            if (!await api.hasFile(`${this.projectDir}/package.json`)) {
                this.error = "项目目录中没有package.json文件, 无法启动打包!";
                this.loading = false;
                return;
            }

            var config = await api.readJSON(`${this.projectDir}/package.json`);
            var version = 'v37.2.1';
            if (config.devDependencies && config.devDependencies.electron) {
                version = config.devDependencies.electron.replace('^', '');
            }

            this.loading = true;

            this.message = '正在下载Electron...';
            var downloadOut = await api.downloadElectron(version);
            if (downloadOut != 'ok') {
                this.error = '下载Electron失败：' + downloadOut;
                this.message = '';
                this.loading = false;
                return;
            }
            console.log(downloadOut);

            this.message = '正在解压Electron...';
            var unzipOut = await api.unzipElectron(version, this.outputDir);
            if (unzipOut != 'ok') {
                this.error = 'Electron解压失败: ' + unzipOut;
                this.message = '';
                this.loading = false;
                return;
            }

            await api.deleteFile(this.outputDir + '/resources/default_app.asar');

            if (config.asar) {
                this.message = '打包项目代码中...';
                var asarOut = await api.asarPackage(this.projectDir, this.outputDir + '/resources/app.asar');
                if (asarOut != 'ok') {
                    this.error = '项目代码打包失败: ' + asarOut;
                    this.message = '';
                    this.loading = false;
                    return;
                }
            } else {
                this.message = '复制项目代码中...';
                await api.copyProjectCode(this.projectDir, this.outputDir + '/resources/app/');
            }


            if (this.icon) {
                this.message = '正在修改程序图标...';
                await api.setIcon(this.outputDir + '/electron.exe', this.icon);
            }

            if (this.projectName) {
                this.message = '正在修改程序文件名...';
                await api.rename(this.outputDir + '/electron.exe', this.outputDir + '/' + this.projectName + '.exe');
            }
            this.loading = false;
            this.success = true;
            this.message = '打包完成';
            setTimeout(() => {
                this.success = false;
            }, 3000);
        },
        stop() {
            this.loading = false;
        }
    }
}

</script>

<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Electron打包工具</h1>
        </div>

        <div class="main-card">
            <div class="config-section">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="projectDir">项目目录</label>
                        <div class="file-upload" id="projectDirUpload" @click="openProjectDir()">
                            <!-- <input type="file" id="projectDir" webkitdirectory directory> -->
                            <div class="file-upload-content" v-if="projectDir">
                                <div class="file-upload-icon">📁</div>
                                <div class="file-upload-text" id="projectDirText">{{ projectDir }}</div>
                            </div>
                            <div class="file-upload-content" v-if="!projectDir">
                                <div class="file-upload-icon">📁</div>
                                <div class="file-upload-text" id="projectDirText">点击选择项目目录</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="appName">程序文件名</label>
                        <input type="text" id="appName" class="form-input" v-model="projectName"
                            placeholder="例如: MyElectronApp" />
                    </div>
                </div>
            </div>

            <div class="config-section">
                <div class="form-group">
                    <label class="form-label" for="appIcon">程序图标</label>
                    <div class="file-upload" id="appIconUpload" @click="openIcon()">
                        <!-- <input type="file" id="appIcon" accept=".ico,.png,.jpg,.jpeg"> -->
                        <div class="file-upload-content" v-if="icon">
                            <div class="file-upload-icon"><img class="icon" :src="icon" alt=""></div>
                            <div class="file-upload-text" id="appIconText">{{ icon }}</div>
                        </div>
                        <div class="file-upload-content" v-if="!icon">
                            <div class="file-upload-icon">🎨</div>
                            <div class="file-upload-text" id="appIconText">选择图标文件 (.ico)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="config-section">
                <div class="form-group">
                    <label class="form-label" for="outputDir">输出目录</label>
                    <div class="file-upload" id="outputDirUpload" @click="openOutputDir">
                        <!-- <input type="file" id="outputDir" webkitdirectory directory> -->
                        <div class="file-upload-content" v-if="outputDir">
                            <div class="file-upload-icon">📦</div>
                            <div class="file-upload-text" id="outputDirText">{{ outputDir }}</div>
                        </div>
                        <div class="file-upload-content" v-if="!outputDir">
                            <div class="file-upload-icon">📦</div>
                            <div class="file-upload-text" id="outputDirText">选择输出目录</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="progress-container" id="progressContainer">
                <div class="progress-label" id="progressLabel">准备打包...</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>

            <div class="status-message status-error" v-if="error">{{ error }}</div>
            <div class="status-message status-message" v-if="message">{{ message }}</div>

            <div class="button-group">
                <button class="btn btn-primary" @click="stop()" v-if="loading">
                    正在打包中...
                </button>
                <button class="btn btn-primary" @click="build()" v-if="!loading">
                    开始打包
                </button>
            </div>
        </div>
    </div>
    <div class="close-button" onclick="window.close()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
    </div>
</template>

<style>
.container {
    -webkit-app-region: drag;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 100vh;
}

.header {
    text-align: center;
    margin-bottom: 50px;
}

.title {
    font-size: 2.8rem;
    font-weight: 300;
    color: #ffffff;
    margin-bottom: 10px;
    position: relative;
}

.title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #4f46e5, #06b6d4);
}

.subtitle {
    color: #9ca3af;
    font-size: 1.1rem;
    margin-top: 20px;
}

.main-card {
    -webkit-app-region: none;
    background: #111111;
    border-radius: 16px;
    padding: 40px;
    border: 1px solid #1f1f1f;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.form-grid {
    display: grid;
    gap: 30px;
}

.form-group {
    position: relative;
}

.form-label {
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
    color: #e5e7eb;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.form-input {
    width: 100%;
    padding: 16px 20px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.form-input:focus {
    outline: none;
    border-color: #4f46e5;
    background: #1f1f1f;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
    color: #6b7280;
}

.file-upload {
    position: relative;
    border: 2px dashed #2a2a2a;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
    background: #1a1a1a;
}

.file-upload:hover {
    border-color: #4f46e5;
    background: #1f1f1f;
}

.file-upload.has-file {
    border-color: #059669;
    background: rgba(5, 150, 105, 0.05);
}

.file-upload input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.file-upload-content {
    pointer-events: none;
}

.file-upload-icon {
    font-size: 2rem;
    margin-bottom: 8px;
    color: #6b7280;
}

.file-upload.has-file .file-upload-icon {
    color: #059669;
}

.file-upload-text {
    color: #9ca3af;
    font-size: 0.9rem;
}

.file-upload.has-file .file-upload-text {
    color: #059669;
    font-weight: 500;
}

.button-group {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    justify-content: flex-end;
}

.btn {
    padding: 14px 32px;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: linear-gradient(135deg, #4f46e5, #06b6d4);
    color: #ffffff;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
}

.progress-container {
    margin-top: 30px;
    display: none;
}

.progress-label {
    color: #9ca3af;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #1f1f1f;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5, #06b6d4);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 4px;
}

.status-message {
    margin-top: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    border-left: 4px solid;
}

.status-success {
    background: rgba(5, 150, 105, 0.1);
    border-color: #059669;
    color: #10b981;
}

.status-error {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #f87171;
}

.config-section {
    margin-bottom: 40px;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #2a2a2a;
}

@media (max-width: 768px) {
    .container {
        padding: 20px 15px;
    }

    .title {
        font-size: 2.2rem;
    }

    .main-card {
        padding: 25px;
    }

    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}

/* 简单的加载动画 */
.loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}


.icon {
    width: 60px;
    border-radius: 5px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.close-button {
    -webkit-app-region: no-drag;
    position: fixed;
    top: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 1000;
    color: #ffffff;
}

.close-button:hover {
    background: rgba(255, 0, 0, 0.2);
    border-color: rgba(255, 0, 0, 0.5);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 10px 20px rgba(255, 0, 0, 0.3);
}

.close-button svg {
    transition: all 0.3s ease;
}

.close-button:hover svg {
    color: #ff4444;
}
</style>