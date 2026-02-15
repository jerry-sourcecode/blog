import { defineStore } from 'pinia';
import { type Ref, ref, watch } from 'vue';
import { Document, File, Folder, type Item } from './model.ts';
import { TypeJson } from '../utils/typeJson.ts';
import { API } from '../utils/api.ts';

export const useFileSystemStore = defineStore('FileSystem', () => {
    const text: Ref<Document[]> = ref([]);

    const root = ref(new Folder(':', null)) as Ref<Folder>;
    let currentPartition = ref('');

    function fromString<T>(path: string): T | null {
        const parts = path.split('/').filter(Boolean); // Split the path and remove empty strings
        let current: Item = root.value;
        const findFile = path[path.length - 1] !== '/';

        for (let i = 1, len = parts.length; i < len; i++) {
            let part = parts[i];
            // 处理 Folder 的 filename 后缀为 / 的问题
            // 为寻找 Folder 的 part 增加 /
            if (!findFile || i != len - 1) {
                part += '/';
            }
            let found = false;
            for (const sub of (current as Folder).sub) {
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

    function removeItem(path: string): boolean {
        const item = fromString<Item>(path);
        if (item == null) return false;
        const fa = item?.pos;
        if (!fa) return false;
        fa.sub.splice(
            fa.sub.findIndex((v) => v.to_string() === path),
            1,
        );
        return true;
    }

    function copy<T extends Item>(item: T) {
        const copied = TypeJson.copy<T>(item);
        copied.pos = fromString(copied.pos_path!);
        return copied;
    }

    function isFolder(path: string): boolean {
        return path[path.length - 1] === '/';
    }

    watch(
        root,
        (value) => {
            API.setData('root', TypeJson.stringify(value));
        },
        { deep: true },
    );

    return {
        root,
        copy,
        fromString,
        removeItem,
        isFolder,
        text,
        currentPartition,
    };
});
