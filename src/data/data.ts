import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { Document, File, Folder } from './model.ts';

export const useFileSystemStore = defineStore('FileSystem', () => {
    const text: Ref<Document[]> = ref([]);

    const root = ref<Folder>(new Folder(':', null));
    let currentPartition = ref('');

    function fromString<T>(path: string): T | null {
        const parts = path.split('/').filter(Boolean); // Split the path and remove empty strings
        let current: Folder = root.value;
        const findFile = path[path.length - 1] !== '/';

        for (let i = 1, len = parts.length; i < len; i++) {
            const part = parts[i];
            let found = false;
            for (const sub of current.sub) {
                if (i == len - 1 && findFile && sub instanceof Folder) continue;
                if (i == len - 1 && !findFile && sub instanceof File) continue;
                if (sub.filename() === part) {
                    if (sub instanceof File) {
                        if (!findFile || i != len - 1) {
                            continue;
                        } else {
                            return sub as T;
                        }
                    }
                    current = sub;
                    found = true;
                    break;
                }
            }
            if (!found) {
                // If not found, create a new one
                return null;
            }
        }
        return current as T;
    }

    return {
        root,
        fromString,
        text,
        currentPartition,
    };
});
