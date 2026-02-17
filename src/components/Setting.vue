<template>
    <n-card
        :bordered="false"
        aria-modal="true"
        content-class="setting-card"
        size="huge"
        style="width: 1000px; height: 90vh"
        title="设置"
    >
        <n-menu
            v-model:value="activeKey"
            :options="menuOptions"
            responsive
            style="width: 200px"
        />
        <div class="setting-content">
            <!-- 可切换的内容区域 -->
            <div v-if="activeKey === 'partition'" class="setting-panel">
                <n-h1>分区设置</n-h1>
                <n-dynamic-input
                    v-model:value="partitionList"
                    class="dynamic-input-scroll"
                    placeholder="请输入"
                    show-sort-button
                    @create="onCreate"
                >
                    <template #default="obj">
                        <n-input
                            v-model:value="(obj.value as Folder).name"
                            placeholder="输入分区名称"
                            type="text"
                        />
                    </template>
                </n-dynamic-input>
            </div>
            <!-- 按钮始终在底部右侧 -->
            <div class="action-bar">
                <n-button @click="emitter.emit('settingModalClose')">
                    取消
                </n-button>
                <n-button
                    style="margin-left: 10px"
                    type="info"
                    @click="onApply"
                >
                    应用
                </n-button>
            </div>
        </div>
    </n-card>
</template>

<script lang="ts" setup>
import {
    NButton,
    NCard,
    NMenu,
    NInput,
    type MenuOption,
    NDynamicInput,
    NH1,
} from 'naive-ui';
import { onMounted, type Ref, ref } from 'vue';
import { useEmitter } from '../utils/emitter.ts';
import { useFileSystemStore } from '../data/data.ts';
import { Folder } from '../data/model.ts';
import { TypeJson } from '../utils/typeJson.ts';
import { recovery } from '../utils/utils.ts';

const emitter = useEmitter();
const dataStore = useFileSystemStore();

const activeKey = ref('partition');

const menuOptions: MenuOption[] = [
    {
        label: '分区',
        key: 'partition',
    },
];

const partitionList: Ref<any[]> = ref([]);

onMounted(() => {
    partitionList.value = TypeJson.copy(dataStore.root.sub);
});

function onApply() {
    dataStore.root.sub = partitionList.value;
    recovery(dataStore.root);
}

function onCreate() {
    return new Folder('新建分区', dataStore.root);
}
</script>

<style>
.setting-card {
    display: flex;
    width: 100%;
    height: 0;
}

.setting-content {
    flex: 1;
    margin: 10px;
    display: flex;
    flex-direction: column;
    min-height: 0; /* 允许内部滚动 */
}

.setting-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* 同上 */
}

.dynamic-input-scroll {
    flex: 1;
    overflow-y: auto; /* 出现滚动条 */
    /* 可选：增加一点内边距让滚动条不紧贴文字 */
    padding-right: 4px;
}

.action-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}
</style>
