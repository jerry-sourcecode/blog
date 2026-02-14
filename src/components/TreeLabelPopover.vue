<template>
    <n-popover placement="right">
        <template #trigger>
            <div>{{ label }}</div>
        </template>
        <div>
            <h2>{{ info?.title }}</h2>
            <hr class="divide" />
            作者：{{ info?.writer }}<br />
            最近更新于{{ formatDate(info?.lastModifiedTime!) }}
        </div>
    </n-popover>
</template>

<script lang="ts" setup>
import { NPopover } from 'naive-ui';
import { Document } from '../data/model.ts';
import { formatDate } from '../utils/utils.ts';

defineProps({
    label: {
        type: String,
    },
    info: {
        type: Document,
    },
});
</script>

<style scoped>
.divide {
    margin-bottom: 10px;
}
</style>
