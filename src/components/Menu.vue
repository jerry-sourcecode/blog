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
                <n-form
                    ref="formRef"
                    :model="formValue"
                    :rules="rules"
                    size="large"
                >
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
                        <n-button type="info" @click="onDetermine">
                            确定
                        </n-button>
                        <n-button @click="showModal = false"> 取消 </n-button>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-modal>
        <div style="margin-top: 5px">
            <n-tooltip v-if="!isChecking" trigger="hover">
                <template #trigger>
                    <n-button class="icon" text @click="handleSelect">
                        <n-icon>
                            <AddOutline />
                        </n-icon>
                    </n-button>
                </template>
                增加文件或目录
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button class="icon" text @click="handleStartCheck">
                        <n-icon>
                            <CheckOutline />
                        </n-icon>
                    </n-button>
                </template>
                <span v-if="isChecking">取消</span>选择
            </n-tooltip>
            <n-tooltip v-if="isChecking" trigger="hover">
                <template #trigger>
                    <n-button class="icon" text @click="handleRemove">
                        <n-icon>
                            <RiDeleteBinLine />
                        </n-icon>
                    </n-button>
                </template>
                删除所选项
            </n-tooltip>
        </div>
        <n-tree
            ref="treeRef"
            v-model:checked-keys="treeCheckedKeys"
            v-model:expanded-keys="treeExpandedKeys"
            :checkable="isChecking"
            :data="data"
            :node-props="nodeProps"
            :style="`height: ${treeHeight}; overflow-y: auto`"
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
    type FormItemRule,
    type FormInst,
    type TreeInst,
    useNotification,
} from 'naive-ui';
import { computed, h, onMounted, onUnmounted, type Ref, ref } from 'vue';
import { Folder, Document, File, type Item } from '../data/model.ts';
import { useFileSystemStore } from '../data/data.ts';
import {
    RiFolder2Line as FolderOutline,
    RiFileLine as DocumentTextOutline,
    RiAddLine as AddOutline,
    RiListCheck3 as CheckOutline,
    RiDeleteBinLine,
} from '@remixicon/vue';
import { useEmitter } from '../data/emitter.ts';

const dataStore = useFileSystemStore();
const emitter = useEmitter();

const formRef: Ref<FormInst | null> = ref(null);
const treeRef: Ref<TreeInst | null> = ref(null);

const props = defineProps({
    partition: String,
});

const convertFolderToTree = (root: Folder): TreeOption[] => {
    function sort(fol: Folder) {
        return fol.sub.sort((a, b) => {
            if (a instanceof Folder && !(b instanceof Folder)) return -1;
            if (!(a instanceof Folder) && b instanceof Folder) return 1;
            return a.name.localeCompare(b.name);
        });
    }
    // 递归转换函数
    const convertItem = (item: Item): TreeOption => {
        if (item instanceof Folder) {
            const node: TreeOption = {
                key: item.toString(),
                label: item.name,
                prefix: () =>
                    h(NIcon, null, { default: () => h(FolderOutline) }),
            };

            if (item.sub && item.sub.length > 0) {
                // 对子节点进行排序：文件夹优先，其余文件按字典序
                const sortedSubItems = sort(item);

                node.children = sortedSubItems.map((subItem) =>
                    convertItem(subItem),
                );
            }

            return node;
        } else {
            return {
                key: item.toString(),
                label: item.name,
                prefix: () =>
                    h(NIcon, null, { default: () => h(DocumentTextOutline) }),
            };
        }
    };

    if (!root.sub || root.sub.length === 0) {
        return [];
    }

    // 对根节点的所有子节点进行排序
    const sortedRootSubItems = sort(root);

    return sortedRootSubItems.map((item) => convertItem(item));
};

/**
 * 为节点设置属性，包括点击事件处理。
 * @param param - 包含配置选项的对象
 * @param param.option - 树节点的选项对象，包含children, disabled, key等属性
 * @return 返回一个对象，该对象包含一个onClick方法，用于处理节点被点击时的行为
 */
function nodeProps({ option }: { option: TreeOption }) {
    return {
        onClick() {
            if (!(option.key as string).endsWith('/') && !option.disabled) {
                dataStore.text.push(
                    dataStore.fromString<Document>(
                        option.key as string,
                    ) as Document,
                );
                emitter.emit('documentAppend', dataStore.text.length - 1);
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

/**
 * 重命名指定的项目。
 * @param item - 要重命名的项目。
 * @return 不返回任何值。
 */
function rename(item: Item): void;
/**
 * 在指定文件夹中新建项目
 * @param item 此处固定为 'Create'
 * @param dir 包含要新建项目的文件夹
 * @return 无返回值
 */
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

    let fol: Folder;
    if (isCreate.value) {
        fol = target.value as Folder;
    } else {
        fol = target.value?.pos!;
    }
    fol.sub.forEach((item) => {
        filenameSet.add(item.filename());
    });
}

const target: Ref<Item | undefined> = ref(undefined);
const isCreate: Ref<boolean> = ref(false);
const filenameSet = new Set();

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
        validator(_: FormItemRule, value: string) {
            if (!value) {
                return new Error('请输入文件名');
            }
            if (value.includes('/') || value.includes(':')) {
                return new Error('不能含有 / 或 : ');
            }
            let suf;
            if (formValue.value.type === 'Folder') suf = '/';
            if (formValue.value.type === 'Document') suf = '.doc';
            if (filenameSet.has(value + suf)) {
                return new Error(`该目录下已含有同名文件。`);
            }
            return true;
        },
        trigger: ['input', 'blur'],
    },
};

async function onDetermine() {
    try {
        // 验证：如果不通过，会 reject 并抛入 catch
        await formRef.value?.validate();
    } catch (errors) {
        // 信息不通过校验
        // 直接返回拒绝提交请求
        return;
    }

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
    if (isCreate.value) {
        while (
            !(target.value as Folder).isSystem() &&
            treeExpandedKeys.value.findIndex(
                (v) => v === target.value!.toString(),
            ) === -1
        ) {
            treeExpandedKeys.value.push(target.value!.toString());
            target.value = target.value!.pos!;
        }
    }
}

const treeExpandedKeys: Ref<string[]> = ref([]);
const treeCheckedKeys: Ref<string[]> = ref([]);
// 文件命名（终）-----------------------------

// 处理滚动条

const treeHeight = ref('auto');

// 计算编辑器高度
const calculateHeight = () => {
    const windowHeight = window.innerHeight;
    const appElement = document.getElementById('app');

    if (appElement) {
        const appRect = appElement.getBoundingClientRect();
        const appTop = appRect.top;

        // 计算可用高度：窗口高度减去app元素顶部位置
        // 如果发现容器超出屏幕或剩余大量空白，可以调整这里的常数
        const offset = 32 + 24 + 100;
        const availableHeight = windowHeight - appTop - offset;
        treeHeight.value = `${availableHeight}px`;
    }
};

onMounted(() => {
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
});

onUnmounted(() => {
    window.removeEventListener('resize', calculateHeight);
});
// 处理滚动条（终）

// 处理选择
const isChecking = ref(false);
const notification = useNotification();

function handleStartCheck() {
    isChecking.value = !isChecking.value;
}

function handleRemove() {
    const arr = treeRef.value?.getCheckedData();
    if (arr?.keys.length === 0) {
        notification.error({
            title: '无法删除',
            content: `没有选中文件，无法进行删除。`,
            duration: 3000,
            keepAliveOnHover: true,
        });
        return;
    }
    let succ = 0;
    arr?.keys?.forEach((key) => {
        if (dataStore.removeItem(key as string)) {
            succ++;
            // 处理删除
            if (selectedKeys.value === key) {
                selectedKeys.value = undefined;
            }
            if (treeExpandedKeys.value.find((v) => v === key)) {
                treeExpandedKeys.value.splice(
                    treeExpandedKeys.value.findIndex((v) => v === key),
                    1,
                );
            }
            if (treeCheckedKeys.value.find((v) => v === key)) {
                treeCheckedKeys.value.splice(
                    treeCheckedKeys.value.findIndex((v) => v === key),
                    1,
                );
            }
        }
    });
    const has_num: number = arr?.keys.length!;
    notification[succ === has_num ? 'success' : 'error']({
        title: '删除操作报告',
        content: `共尝试删除${has_num}个文件或文件夹，成功删除${succ}个，成功率${Math.round((has_num * 100) / succ)}%`,
        duration: 3000,
        keepAliveOnHover: true,
    });
}
// 处理选择（终）
</script>

<style scoped>
.icon {
    font-size: 24px;
    margin-right: 7px;
}
</style>
