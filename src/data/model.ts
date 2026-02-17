import { useContentStore } from './content.ts';

class Item {
    name: string;
    pos_path: string | null = null;
    protected pos_obj: Folder | null = null;

    constructor() {
        this.name = '';
    }

    get pos(): Folder | null {
        return this.pos_obj;
    }

    set pos(newValue: Folder | null) {
        this.pos_path = newValue?.to_string() ?? null;
        this.pos_obj = newValue;
    }

    isORin(fa: Folder): boolean {
        const thisPath = this.to_string();
        const faPath = fa.to_string();

        return thisPath.startsWith(faPath);
    }
    to_string() {
        return this.name;
    }
    toString() {
        throw Error('你可能拼错了！正确获取路径调用 to_string() ');
    }
    filename() {
        return this.name;
    }
}

class Folder extends Item {
    sub: Item[];

    constructor(name: string, pos: Folder | null) {
        super();
        this.name = name;
        this.pos = pos;
        this.pos_path = pos?.to_string() ?? null;
        this.sub = [];
    }

    newSubDir(name: string): Folder;
    newSubDir(name: string, type: 'Folder'): Folder;
    newSubDir(name: string, type: 'Document'): Document;
    newSubDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Folder | Document {
        let k;
        if (type === 'Document') k = new Document(name, this, '未知作者', name);
        else k = new Folder(name, this);
        this.sub.push(k);
        return k;
    }
    getSubDir(name: string): Folder;
    getSubDir(name: string, type: 'Folder'): Folder;
    getSubDir(name: string, type: 'Document'): Document;
    getSubDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Document | Folder {
        const rtValue =
            (this.sub.find(
                (x) =>
                    x.name === name &&
                    x instanceof (type === 'Document' ? Document : Folder),
            ) as Document | Folder) ?? null;
        if (rtValue) return rtValue;
        throw new Error(`Subfolders ${name} not found in ${this.to_string()}.`);
    }
    subDir(name: string): Folder;
    subDir(name: string, type: 'Folder'): Folder;
    subDir(name: string, type: 'Document'): Document;
    subDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Folder | Document {
        try {
            return this.getSubDir(name, type as any);
        } catch {
            return this.newSubDir(name, type as any);
        }
    }
    to_string(): string {
        if (this.pos == null) {
            return this.name + '/';
        }
        return this.pos!.to_string() + this.name + '/';
    }
    filename(): string {
        return super.filename() + '/';
    }
    isRoot(): boolean {
        return this.pos == null;
    }
    isSystem(): boolean {
        return this.isRoot() || this.pos?.pos === null;
    }
    /**
     * 检查当前项是否在给定文件夹的子孙目录中
     * @param fa 目标文件夹对象
     * @returns 如果当前项在 fa 内部且不是 fa 本身，返回 true；否则返回 false
     */
}

class File extends Item {
    constructor(name: string, pos: Folder) {
        super();
        this.pos_path = pos?.to_string() ?? null;
        this.name = name;
        this.pos = pos;
    }

    get pos(): Folder {
        return super.pos!;
    }

    set pos(newValue: Folder) {
        super.pos = newValue;
    }

    to_string(): string {
        return this.pos.to_string() + this.name;
    }
    filename(): string {
        return super.filename();
    }
}

class Document extends File {
    writer: string;
    title: string;
    contentPointer: number;
    creationTime: Date;
    lastModifiedTime: Date;
    // 用户是否正在编辑
    hasEdited: boolean;
    // 用户在编辑器中编辑后但没有保存的内容
    tmpContent: string;
    constructor(
        name: string,
        pos: Folder,
        writer: string,
        title: string,
        giveNewContentPointer: boolean = true,
    ) {
        const contentStore = useContentStore();
        super(name, pos);
        this.writer = writer;
        this.title = title;
        this.contentPointer = giveNewContentPointer
            ? contentStore.getNewPosition()
            : -1;
        this.creationTime = new Date();
        this.lastModifiedTime = new Date();
        this.hasEdited = false;
        this.tmpContent = '';
    }
    get content() {
        const contentStore = useContentStore();
        return contentStore.get(this);
    }
    set content(content: string) {
        const contentStore = useContentStore();
        contentStore.set(this, content);
    }
    to_string(): string {
        return super.to_string() + '.doc';
    }
    filename(): string {
        return super.filename() + '.doc';
    }
}

export { Folder, File, type Item, Document };
