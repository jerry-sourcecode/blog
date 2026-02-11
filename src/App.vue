<template>
    <div>
        <n-page-header>
            <template #title> 博客 </template>
            <template #extra>
                <n-space>
                    <n-button>设置</n-button>
                </n-space>
            </template>
        </n-page-header>
        <n-tabs
            :default-value="partition"
            style="flex: 1; display: flex; flex-direction: column"
            type="line"
            @update:value="onPartitionTabChange"
        >
            <n-tab
                v-for="(item, idx) in dataStore.root.sub"
                :key="idx"
                :name="idx"
                :tab="item.name"
            />
        </n-tabs>
        <n-layout has-sider style="flex: 1">
            <n-layout-sider>
                <Menu
                    v-for="(item, idx) in dataStore.root.sub"
                    v-show="idx === partition"
                    :partition="item.name"
                />
            </n-layout-sider>
            <n-layout content-style="padding: 24px">
                <Editor />
            </n-layout>
        </n-layout>
    </div>
</template>

<script lang="ts" setup>
import {
    NLayout,
    NLayoutSider,
    NPageHeader,
    NSpace,
    NButton,
    NTabs,
    NTab,
} from 'naive-ui';
import Menu from './components/Menu.vue';
import Editor from './components/Editor.vue';
import { useFileSystemStore } from './data/data.ts';
import { ref } from 'vue';

const dataStore = useFileSystemStore();

const FA = dataStore.root.subDir('A');
const FB = dataStore.root.subDir('B');

FA.subDir('B', 'Document');
FB.subDir('C').subDir('D').subDir('E', 'Document').content = '11223333';

const partition = ref(0);

function onPartitionTabChange(name: number) {
    partition.value = name;
}
</script>
