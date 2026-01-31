<script setup lang="ts">
import {NLayout, NLayoutSider, NLayoutContent, NPageHeader, NSpace, NButton, NTabs, NTabPane} from 'naive-ui'
import Menu from "./components/Menu.vue";
</script>

<template>
    <n-page-header subtitle="有趣">
        <template #title>
            博客
        </template>
        <template #extra>
            <n-space>
                <n-button>设置</n-button>
            </n-space>
        </template>
    </n-page-header>
    <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="Oasis">
            <n-layout has-sider>
                <n-layout-sider content-style="padding: 24px;">
                    <Menu />
                </n-layout-sider>
                <n-layout>
                    <n-layout-content content-style="padding: 24px;">
                        阅读器
                    </n-layout-content>
                </n-layout>
            </n-layout>
        </n-tab-pane>
    </n-tabs>
</template>

<style scoped>
</style>
