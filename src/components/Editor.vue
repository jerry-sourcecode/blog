<template>
    <n-tabs
        v-if="dataStore.text.length != 0"
        v-model:value="tabValue"
        closable
        size="small"
        type="card"
        @close="onTabClose"
    >
        <n-tab-pane
            v-for="(txt, idx) in dataStore.text"
            :name="idx"
            :tab="txt.name + `*`.if(txt.hasEdited)"
        >
            <h1>{{ txt.name }}</h1>
            <div :style="`height: ${editorHeight}`" class="editor-container">
                <!-- 完整的编辑器 -->
                <MdEditor
                    ref="editorRef"
                    v-model="tmpContents[idx]"
                    :autoFoldThreshold="100"
                    :footers="footers"
                    :toolbars="[
                        `task`,
                        `link`,
                        'image',
                        'table',
                        'mermaid',
                        '-',
                        0,
                        'save',
                        '=',
                        'prettier',
                        'pageFullscreen',
                        'fullscreen',
                        'preview',
                        'previewOnly',
                        'catalog',
                    ]"
                    class="markdown-editor"
                    previewTheme="github"
                    @change="onChange(idx)"
                    @save="onSave(idx)"
                >
                    <template #defToolbars>
                        <NormalToolbar title="搜索" @onClick="onSearch">
                            <RiSearchLine
                                class="md-editor-icon"
                                style="fill: black"
                            />
                        </NormalToolbar>
                    </template>
                    <template #defFooters>
                        <NormalFooterToolbar>
                            作者：{{ txt.writer }}
                        </NormalFooterToolbar>
                    </template>
                </MdEditor>
            </div>
        </n-tab-pane>
    </n-tabs>
    <n-empty v-else description="还没有打开的文件" size="huge" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import {
    MdEditor,
    type Footers,
    NormalFooterToolbar,
    NormalToolbar,
} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useFileSystemStore } from '../data/data.ts';
import { NEmpty, NTabPane, NTabs } from 'naive-ui';
import { useEmitter } from '../utils/emitter.ts';
import { RiSearchLine } from '@remixicon/vue';
import { openSearchPanel } from '@codemirror/search';

const dataStore = useFileSystemStore();
const emitter = useEmitter();

const tabValue = ref(0);

const editorHeight = ref('auto');
const editorRef: Ref<(typeof MdEditor)[]> = ref([]);
const tmpContents: Ref<string[]> = ref([]);

// 计算编辑器高度
const calculateHeight = () => {
    const windowHeight = window.innerHeight;
    const appElement = document.getElementById('app');

    if (appElement) {
        const appRect = appElement.getBoundingClientRect();
        const appTop = appRect.top;

        // 计算可用高度：窗口高度减去app元素顶部位置
        // 如果发现容器超出屏幕或剩余大量空白，可以调整这里的常数
        const offset = 32 + 24 + 175; // 偏移量
        const availableHeight = windowHeight - appTop - offset;
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
    tmpContents.value.splice(name, 1);
    if (tabValue.value === dataStore.text.length) tabValue.value -= 1;
}

emitter.on('documentAppend', (idx: number) => {
    tabValue.value = idx;
    tmpContents.value.push(dataStore.text[idx]!.content);
});

function onChange(idx: number) {
    dataStore.text[idx]!.hasEdited = true;
}

function onSave(idx: number) {
    const obj = dataStore.text[idx]!;
    obj.hasEdited = false;
    obj.content = tmpContents.value[idx]!;
}

const footers: Footers[] = ['markdownTotal', 0, '=', 'scrollSwitch'];

function onSearch() {
    openSearchPanel(editorRef.value[tabValue.value]!.getEditorView());
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
