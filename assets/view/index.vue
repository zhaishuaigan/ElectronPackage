<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        addProject() {
            window.open('#project', '', 'width=600,height=960,frame=false');
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Electron打包工具</h1>
            <p class="subtitle"></p>
        </div>

        <div class="projects-grid">
            <div class="project-card" @click="addProject()">
                <div class="project-icon">
                    <!-- <img src=" " alt="添加项目" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">添加新项目</h3>
                    <!-- <div class="project-path"></div> -->
                </div>
            </div>

            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
            </div>
            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
            </div>
            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
            </div>
            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
            </div>
            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
            </div>
            <div class="project-card">
                <div class="project-icon">
                    <!-- <img src=" " alt="Vue.js App" /> -->
                </div>
                <div class="project-content">
                    <h3 class="project-name">Vue.js App</h3>
                    <div class="project-path">项目目录: /home/user/projects/vue-application</div>
                </div>
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
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

}

.header {
    text-align: center;
    padding: 3rem;
}

.title {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(45deg, #00d4ff, #ff00ff, #00ff88);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 3s ease-in-out infinite;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.2rem;
    color: #888;
    font-weight: 300;
}

@keyframes gradientShift {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.projects-grid {
    flex: 1;
    padding-top: 2rem;
    -webkit-app-region: none;
    overflow-y: scroll;
    max-height: 80vh;
    scrollbar-width: none;
}

.projects-grid::-webkit-scrollbar {
    width: 8px;
}

.projects-grid::-webkit-scrollbar-track {
    background: transparent;
}

.projects-grid::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}

.projects-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

.project-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 1.5rem 2rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}


.project-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 212, 255, 0.5);
}

.project-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: linear-gradient(45deg, #00d4ff, #ff00ff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 0;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
}

.project-icon img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: brightness(0) invert(1);
}

.project-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 1.5rem;
}

.project-name {
    font-size: 1.2rem;
    line-height: 2.4rem;
    font-weight: 600;
    margin-bottom: 0;
    color: #ffffff;
    position: relative;
    z-index: 1;
}

.project-path {
    color: #888;
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border-left: 3px solid #00d4ff;
    position: relative;
    z-index: 1;
    margin: 0;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(0, 212, 255, 0.6);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
}

.particle:nth-child(2n) {
    background: rgba(255, 0, 255, 0.6);
    animation-delay: -2s;
}

.particle:nth-child(3n) {
    background: rgba(0, 255, 136, 0.6);
    animation-delay: -4s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0;
    }

    10%,
    90% {
        opacity: 1;
    }

    50% {
        transform: translateY(-100px) rotate(180deg);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .title {
        font-size: 2rem;
    }

    .projects-grid {
        gap: 1rem;
    }

    .project-card {
        padding: 1rem 1.5rem;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }

    .project-content {
        align-items: center;
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