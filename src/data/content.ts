import { defineStore } from 'pinia';
import type { Document } from './model.ts';
import { type Ref, ref } from 'vue';

export const useContentStore = defineStore('content', () => {
    const contents: Ref<Array<string | null>> = ref([]);

    const empty: Ref<number[]> = ref([]);

    function get(document: Document) {
        return contents.value[document.contentPointer] as string;
    }
    function set(document: Document, value: string) {
        contents.value[document.contentPointer] = value;
    }
    function del(document: Document) {
        contents.value[document.contentPointer] = null;
        empty.value.push(document.contentPointer);
    }
    function getNewPosition(): number {
        if (empty.value.length === 0) {
            contents.value.push('');
            return contents.value.length;
        }
        return empty.value.pop() as number;
    }

    return {
        contents,
        empty,
        get,
        set,
        del,
        getNewPosition,
    };
});
