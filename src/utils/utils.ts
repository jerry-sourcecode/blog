import { Folder } from '../data/model.ts';
import { useFileSystemStore } from '../data/data.ts';

/**
 * 递归恢复文件夹及其子项的位置和内容。由于经过 TypeJson 压缩后 pos_obj 会消失，因此粗腰进行还原
 * @param fol - 要恢复的文件夹对象。
 * @return 没有返回值。此方法通过修改传入的文件夹对象来工作。
 */
function recovery(fol: Folder) {
    const dataStore = useFileSystemStore();
    fol.sub.forEach((item) => {
        item.pos = dataStore.fromString<Folder>(item.pos_path!);
        if (item instanceof Folder) {
            recovery(item);
        }
    });
}

export { recovery };
