<template>
    <div>
        <n-modal v-model:show="showModal">
            <n-card
                :bordered="false"
                aria-modal="true"
                role="dialog"
                size="huge"
                style="width: 600px"
                title="设置文件属性"
            >
                <n-form :model="formValue" :rules="rules" size="large">
                    <n-form-item label="文件类型" path="type">
                        <n-select
                            v-model:value="formValue.type"
                            :options="typeOptions"
                            @update:value="onUpdateTypeSelect"
                        />
                    </n-form-item>
                    <n-form-item v-if="hasAttu.name" label="文件名" path="name">
                        <n-input
                            v-model:value="formValue.name"
                            placeholder="输入文件名"
                        />
                    </n-form-item>
                    <n-form-item v-if="hasAttu.auth" label="作者" path="auth">
                        <n-input
                            v-model:value="formValue.auth"
                            placeholder="输入作者"
                        />
                    </n-form-item>
                    <n-form-item
                        v-if="hasAttu.title"
                        label="作品标题"
                        path="title"
                    >
                        <n-input
                            v-model:value="formValue.title"
                            placeholder="作品标题"
                        />
                    </n-form-item>
                    <n-form-item>
                        <n-button
                            style="margin-right: 20px"
                            type="info"
                            @click="onDetermine"
                        >
                            确定
                        </n-button>
                        <n-button @click="showModal = false"> 取消 </n-button>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-modal>
        <div>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button
                        style="font-size: 24px; margin-top: 10px"
                        text
                        @click="handleSelect"
                    >
                        <n-icon>
                            <AddOutline />
                        </n-icon>
                    </n-button>
                </template>
                增加文件或目录
            </n-tooltip>
        </div>
        <n-tree
            ref="treeRef"
            :data="data"
            :node-props="nodeProps"
            block-line
            expand-on-click
            @update:selected-keys="onKeySelected"
        ></n-tree>
    </div>
</template>

<script lang="ts" setup>
import {
    NTree,
    type TreeOption,
    type SelectOption,
    NIcon,
    NButton,
    NTooltip,
    NModal,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
} from 'naive-ui';
import { computed, h, type Ref, ref } from 'vue';
import { Folder, Document, File, type Item } from '../data/model.ts';
import { useFileSystemStore } from '../data/data.ts';
import {
    FolderOutline,
    DocumentTextOutline,
    AddOutline,
} from '@vicons/ionicons5';

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
                prefix: () => {
                    return h(NIcon, null, {
                        default: () => h(FolderOutline),
                    });
                },
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
                prefix: () => {
                    return h(NIcon, null, {
                        default: () => h(DocumentTextOutline),
                    });
                },
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

function nodeProps({ option }: { option: TreeOption }) {
    return {
        onClick() {
            if (!option.children && !option.disabled) {
                dataStore.text.push(
                    dataStore.fromString<Document>(
                        option.key as string,
                    ) as Document,
                );
            }
        },
    };
}

const data = computed(() =>
    convertFolderToTree(dataStore.root.getSubDir(props.partition!)),
);

// 增加文件 -------------------

const selectedKeys: Ref<string | undefined> = ref(undefined);

function onKeySelected(keys: string[]) {
    selectedKeys.value = keys[0];
}

function handleSelect() {
    let select = dataStore.root.getSubDir(props.partition!);
    if (selectedKeys.value) {
        let sl = dataStore.fromString<Item>(selectedKeys.value)!;
        if (sl instanceof File) {
            sl = sl.pos;
        }
        select = sl;
    }
    rename('Create', select);
}

// 增加文件（终）-------------------------

// 文件命名 ---------------------------
const showModal = ref(false);

function rename(item: Item): void;
function rename(item: 'Create', dir: Folder): void;
function rename(item: Item | 'Create', dir?: Folder): void {
    formValue.value.name = '';
    formValue.value.title = '';
    formValue.value.auth = '';

    hasAttu.value.name = true;

    // 默认 Folder
    onUpdateTypeSelect('Folder');

    showModal.value = true;

    isCreate.value = typeof item === 'string';
    target.value = isCreate.value ? dir : (item as Item);
}

const target: Ref<Item | undefined> = ref(undefined);
const isCreate: Ref<boolean> = ref(false);

const formValue = ref({
    type: '',
    name: '',
    auth: '',
    title: '',
});

const hasAttu = ref({
    name: false,
    auth: false,
    title: false,
});

function onUpdateTypeSelect(type: 'Folder' | 'Document') {
    hasAttu.value.name = false;
    hasAttu.value.auth = false;
    hasAttu.value.title = false;
    if (type === 'Folder') {
        hasAttu.value.name = true;
        formValue.value.type = 'Folder';
    } else {
        formValue.value.type = 'Document';
        hasAttu.value.title = true;
        hasAttu.value.auth = true;
        hasAttu.value.name = true;
    }
}

const typeOptions: SelectOption[] = [
    {
        value: 'Folder',
        label: () => {
            return h('div', { class: 'selectDiv' }, [
                h(NIcon, { class: 'selectIcon' }, () => h(FolderOutline)),
                '目录',
            ]);
        },
    },
    {
        label: () => {
            return h('div', { class: 'selectDiv' }, [
                h(NIcon, { class: 'selectIcon' }, () => h(DocumentTextOutline)),
                '文档',
            ]);
        },
        value: 'Document',
    },
];

const rules = {
    name: {
        required: true,
        message: '请输入文件名',
        trigger: 'blur',
    },
};

function onDetermine() {
    let item;
    if (isCreate.value) {
        if (formValue.value.type === 'Folder') {
            item = (target.value as Folder).subDir(formValue.value.name);
        } else {
            item = (target.value as Folder).subDir(
                formValue.value.name,
                'Document',
            );
        }
    } else {
        item = target;
    }

    switch (formValue.value.type) {
        case 'Folder': {
            break;
        }
        case 'Document': {
            (item as Document).title = formValue.value.title;
            (item as Document).writer = formValue.value.auth;
            break;
        }
    }

    showModal.value = false;
}
// 文件命名（终）-----------------------------
</script>

<style scoped></style>
