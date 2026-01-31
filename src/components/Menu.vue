<template>
<div>
    <n-tree
        block-line
        :data="data"
        selectable></n-tree>
</div>
</template>

<script setup lang="ts">
import { NTree, type TreeOption } from "naive-ui"
import { ref, type Ref } from "vue";

const data: Ref<TreeOption[]> = ref([
    {
        key: "1231213",
        label: "12321",
        children: [
            {
            key: "123",
            label: "123",
        },
        {
            key: "23",
            label: "123242",
        },
        ],
    }
]);
</script>

<style scoped>

</style>