<script lang="ts" setup>
import {
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NPageHeader,
    NSpace,
    NButton,
    NTabs,
    NTabPane,
    NEmpty,
} from 'naive-ui';
import Menu from './components/Menu.vue';
import Editor from './components/Editor.vue';
import { useFileSystemStore } from './data/data.ts';
import { Document } from './data/model.ts';

const dataStore = useFileSystemStore();

function changeMode() {
    dataStore.isPreview = !dataStore.isPreview;
}

const FA = dataStore.root.subDir('A');
const FB = dataStore.root.subDir('B');

FA.subDir('B', 'File');
FB.subDir('C').subDir('D').subDir('E', 'File');

dataStore.text.push(
    new Document('你好', dataStore.root, '', '', 'nello world', '114514'),
);
dataStore.text.push(
    new Document('再见', dataStore.root, '', '', 'nello world', '114514'),
);

function onTabClose(name: number) {
    dataStore.text.splice(name, 1);
}
</script>

<template>
    <div>
        <n-page-header>
            <template #title> 博客 </template>
            <template #extra>
                <n-space>
                    <n-button>设置</n-button>
                    <n-button @click="changeMode"
                        >切换至{{
                            dataStore.isPreview ? '编辑' : '预览'
                        }}</n-button
                    >
                </n-space>
            </template>
        </n-page-header>
        <n-tabs
            style="flex: 1; display: flex; flex-direction: column"
            type="line"
        >
            <n-layout has-sider style="flex: 1">
                <n-tab-pane
                    v-for="item in dataStore.root.sub"
                    :name="item.name"
                    :tab="item.name"
                >
                    <n-layout-sider content-style="padding: 24px;">
                        <Menu :partition="item.name" />
                    </n-layout-sider>
                    <n-layout>
                        <n-layout-content content-style="padding: 24px;">
                            <n-tabs
                                v-if="dataStore.text.length != 0"
                                closable
                                size="small"
                                type="card"
                                @close="onTabClose"
                            >
                                <n-tab-pane
                                    v-for="(txt, idx) in dataStore.text"
                                    :key="idx"
                                    :name="txt.name"
                                    :tab="txt.name"
                                >
                                    <Editor
                                        v-model="dataStore.text[idx]!.content"
                                    />
                                </n-tab-pane>
                            </n-tabs>
                            <n-empty
                                v-else
                                description="还没有打开的文件"
                                size="huge"
                            />
                        </n-layout-content>
                    </n-layout>
                </n-tab-pane>
            </n-layout>
        </n-tabs>
    </div>
</template>
