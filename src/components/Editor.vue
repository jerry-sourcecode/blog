<template>
    <div
        class="editor-container"
        v-if="dataStore.isPreview"
        :style="`height: ${editorHeight}`"
    >
        <!-- 完整的编辑器 -->
        <VMdPreview
            :text="dataStore.text"
            :height="editorHeight"
            class="markdown-editor"
        ></VMdPreview>
    </div>
    <div class="editor-container" v-else>
        <VMdEditor
            v-model="dataStore.text"
            class="markdown-editor"
            :height="editorHeight"
        ></VMdEditor>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import { useFileSystemStore } from '../data/data.ts';

const dataStore = useFileSystemStore();

const editorHeight = ref('auto');

// 计算编辑器高度
const calculateHeight = () => {
    const windowHeight = window.innerHeight;
    const appElement = document.getElementById('app');

    if (appElement) {
        const appRect = appElement.getBoundingClientRect();
        const appTop = appRect.top;

        // 计算可用高度：窗口高度减去app元素顶部位置
        const availableHeight = windowHeight - appTop - 32 - 24 - 110; // 减去一些边距
        editorHeight.value = `${Math.max(300, availableHeight)}px`; // 最小高度300px
    }
};

onMounted(() => {
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
});

onUnmounted(() => {
    window.removeEventListener('resize', calculateHeight);
});
</script>

<style>
.editor-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.markdown-editor {
    flex: 1;
    overflow-y: auto; /* 内容过多时显示滚动条 */
}
</style>
