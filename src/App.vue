<template>
    <n-notification-provider>
        <n-modal v-model:show="showSettingModal" :mask-closable="false">
            <Setting />
        </n-modal>
        <div>
            <n-page-header>
                <template #title> 博客 </template>
                <template #extra>
                    <n-space>
                        <n-button @click="onSettingModalOpen"> 设置 </n-button>
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
                <n-layout content-style="padding: 5px">
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
    NModal,
} from 'naive-ui';
import Menu from './components/Menu.vue';
import Editor from './components/Editor.vue';
import { useFileSystemStore } from './data/data.ts';
import { ref } from 'vue';
import { TypeJson } from './utils/typeJson.ts';
import { Document, File, Folder } from './data/model.ts';
import Setting from './components/Setting.vue';
import { useContentStore } from './data/content.ts';
import { API } from './utils/api.ts';
import { useEmitter } from './utils/emitter.ts';
import { recovery } from './utils/utils.ts';

const dataStore = useFileSystemStore();
const contentStore = useContentStore();
const emitter = useEmitter();

TypeJson.register(Folder, 'Document', null);
TypeJson.register(File, 'Document', dataStore.root);
TypeJson.register(Document, '', dataStore.root, '', '', false);
TypeJson.setPropertyIgnore(Folder, 'pos_obj');
TypeJson.setPropertyIgnore(File, 'pos_obj');
TypeJson.setPropertyIgnore(Document, 'pos_obj');
TypeJson.setPropertyIgnore(Document, 'tmpContent');
TypeJson.setPropertyIgnore(Document, 'hasEdited');

const partition = ref(0);

function onPartitionTabChange(name: number) {
    partition.value = name;
}

const showSettingModal = ref(false);

emitter.on('settingModalClose', () => (showSettingModal.value = false));

function onSettingModalOpen() {
    showSettingModal.value = true;
}

(function init() {
    contentStore.empty = API.getData('empty') ?? [];
    contentStore.contents = API.getData('contents') ?? [];
    if (API.getData('root') === null) {
        dataStore.root.subDir('默认分区');
    } else {
        dataStore.root = API.getData('root');
    }
    recovery(dataStore.root);
})();
</script>
