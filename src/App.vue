<template>
    <n-notification-provider>
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
    </n-notification-provider>
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
    NNotificationProvider,
} from 'naive-ui';
import Menu from './components/Menu.vue';
import Editor from './components/Editor.vue';
import { useFileSystemStore } from './data/data.ts';
import { ref } from 'vue';

const dataStore = useFileSystemStore();

const FA = dataStore.root.subDir('A');
const FB = dataStore.root.subDir('B');

FA.subDir('B1', 'Document');
FA.subDir('B1', 'Document');
FA.subDir('B2', 'Document');
FA.subDir('B3', 'Document');
FA.subDir('B4', 'Document');
FA.subDir('B5', 'Document');
FA.subDir('B6', 'Document');
FA.subDir('B7', 'Document');
FA.subDir('B8', 'Document');
FA.subDir('B9', 'Document');
FA.subDir('Bq', 'Document');
FA.subDir('Bw', 'Document');
FA.subDir('Be', 'Document');
FA.subDir('Br', 'Document');
FA.subDir('Bt', 'Document');
FA.subDir('By', 'Document');
FA.subDir('Bu', 'Document');
FA.subDir('Bi', 'Document');
FA.subDir('Bo', 'Document');
FA.subDir('Ba', 'Document');
FA.subDir('Baw', 'Document');
FA.subDir('Bae', 'Document');
FA.subDir('Bar', 'Document');
FA.subDir('Bat', 'Document');
FA.subDir('Baf', 'Document');
FA.subDir('Bav', 'Document');
FA.subDir('Bab', 'Document');
FA.subDir('Bay', 'Document');
FA.subDir('Bag', 'Document');
FA.subDir('Bad', 'Document');
FB.subDir('C').subDir('D').subDir('E', 'Document').content = '11223333';

const partition = ref(0);

function onPartitionTabChange(name: number) {
    partition.value = name;
}
</script>
