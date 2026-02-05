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
} from 'naive-ui';
import Menu from './components/Menu.vue';
import Editor from './components/Editor.vue';
import { useFileSystemStore } from './data/data.ts';

const dataStore = useFileSystemStore();

function changeMode() {
    dataStore.isPreview = !dataStore.isPreview;
}
</script>

<template>
    <div>
        <n-page-header subtitle="有趣">
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
            animated
            style="flex: 1; display: flex; flex-direction: column"
            type="line"
        >
            <n-tab-pane name="oasis" tab="Oasis">
                <n-layout has-sider style="flex: 1">
                    <n-layout-sider content-style="padding: 24px;">
                        <Menu />
                    </n-layout-sider>
                    <n-layout>
                        <n-layout-content content-style="padding: 24px;">
                            <Editor />
                        </n-layout-content>
                    </n-layout>
                </n-layout>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
