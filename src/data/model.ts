type Item = File | Folder;

class Folder {
    name: string;
    sub: Item[];
    pos_path: string | null = null;
    private pos_obj: Folder | null = null;

    constructor(name: string, pos: Folder | null) {
        this.name = name;
        this.pos = pos;
        this.pos_path = pos?.toString() ?? null;
        this.sub = [];
    }

    get pos(): Folder | null {
        return this.pos_obj;
    }

    set pos(newValue: Folder | null) {
        this.pos_path = newValue?.toString() ?? null;
        this.pos_obj = newValue;
    }

    newSubDir(name: string): Folder;
    newSubDir(name: string, type: 'Folder'): Folder;
    newSubDir(name: string, type: 'Document'): Document;
    newSubDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Folder | Document {
        let k;
        if (type === 'Document') k = new Document(name, this, '', '', '');
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
        throw new Error(`Subfolders ${name} not found in ${this.toString()}.`);
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
    toString(): string {
        if (this.pos == null) {
            return this.name + '/';
        }
        return this.pos!.toString() + this.name + '/';
    }
    filename(): string {
        return this.name + '/';
    }
    isRoot(): boolean {
        return this.pos == null;
    }
    isSystem(): boolean {
        return this.isRoot() || this.pos?.pos === null;
    }
}

class File {
    name: string;
    pos_path: string = '';
    private pos_obj: Folder | null = null;

    constructor(name: string, pos: Folder) {
        this.pos_path = pos?.toString() ?? null;
        this.name = name;
        this.pos = pos;
    }

    get pos(): Folder {
        return this.pos_obj!;
    }

    set pos(newValue: Folder) {
        this.pos_path = newValue?.toString();
        this.pos_obj = newValue;
    }

    toString(): string {
        return this.pos.toString() + this.name;
    }
    filename(): string {
        return this.name;
    }
}

class Document extends File {
    writer: string;
    title: string;
    content: string;
    creationTime: Date;
    lastModifiedTime: Date;
    constructor(
        name: string,
        pos: Folder,
        writer: string,
        title: string,
        content: string,
    ) {
        super(name, pos);
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.creationTime = new Date();
        this.lastModifiedTime = new Date();
    }
    toString(): string {
        return super.toString() + '.doc';
    }
    filename(): string {
        return super.filename() + '.doc';
    }
}

export { Folder, File, type Item, Document };
