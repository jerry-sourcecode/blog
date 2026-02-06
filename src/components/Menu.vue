<template>
    <div>
        <n-tree :data="data" block-line selectable></n-tree>
    </div>
</template>

<script lang="ts" setup>
import { NTree, type TreeOption } from 'naive-ui';
import { ref, type Ref } from 'vue';
import { Folder, type Item } from '../data/model.ts';
import { useFileSystemStore } from '../data/data.ts';

const dataStore = useFileSystemStore();

const props = defineProps({
    partition: String,
});

const convertFolderToTree = (root: Folder): TreeOption[] => {
    /**
     * 递归转换函数
     * @param item - 要转换的Item节点
     * @returns 转换后的TreeOption
     */
    const convertItem = (item: Item): TreeOption => {
        // 处理文件夹类型
        if (item instanceof Folder) {
            const node: TreeOption = {
                key: item.toString(),
                label: item.name,
            };

            // 如果有子节点，递归转换子节点
            if (item.sub && item.sub.length > 0) {
                node.children = item.sub.map((subItem) => convertItem(subItem));
            }

            return node;
        }
        // 处理文件或Document类型
        else {
            return {
                key: item.toString(),
                label: item.name,
                // 文件节点没有children属性
            };
        }
    };

    // 忽略根节点，只处理根节点的子节点
    if (!root.sub || root.sub.length === 0) {
        return [];
    }

    // 转换根节点的所有子节点
    return root.sub.map((item) => convertItem(item));
};

const data: Ref<TreeOption[]> = ref(
    convertFolderToTree(dataStore.root.getSubDir(props.partition!)),
);
</script>

<style scoped></style>
