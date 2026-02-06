<template>
    <n-tabs
        v-if="dataStore.text.length != 0"
        closable
        size="small"
        type="card"
        @close="onTabClose"
    >
        <n-tab-pane
            v-for="(txt, idx) in dataStore.text"
            :name="idx"
            :tab="txt.name"
        >
            <div :style="`height: ${editorHeight}`" class="editor-container">
                <!-- 完整的编辑器 -->
                <MdEditor
                    v-model="dataStore.text[idx]!.content"
                    :codeFoldable="false"
                    :toolbarsExclude="[`github`, `htmlPreview`]"
                    class="markdown-editor"
                    previewTheme="github"
                ></MdEditor>
            </div>
        </n-tab-pane>
    </n-tabs>
    <n-empty v-else description="还没有打开的文件" size="huge" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useFileSystemStore } from '../data/data.ts';
import { NEmpty, NTabPane, NTabs } from 'naive-ui';

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
        const availableHeight = windowHeight - appTop - 32 - 24 - 150; // 减去一些边距
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

function onTabClose(name: number) {
    dataStore.text.splice(name, 1);
}
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
