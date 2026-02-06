<template>
    <div
        v-if="dataStore.isPreview"
        :style="`height: ${editorHeight}`"
        class="editor-container"
    >
        <!-- 完整的编辑器 -->
        <VMdPreview
            :height="editorHeight"
            :text="text"
            class="markdown-editor"
        ></VMdPreview>
    </div>
    <div v-else class="editor-container">
        <VMdEditor
            v-model="text"
            :height="editorHeight"
            class="markdown-editor"
        ></VMdEditor>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import { useFileSystemStore } from '../data/data.ts';

const text = defineModel<string>();

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
        const availableHeight = windowHeight - appTop - 32 - 24 - 165; // 减去一些边距
        editorHeight.value = `${availableHeight}px`;
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
    height: 90%;
    display: flex;
    flex-direction: column;
}

.markdown-editor {
    flex: 1;
    overflow-y: auto; /* 内容过多时显示滚动条 */
}
</style>
