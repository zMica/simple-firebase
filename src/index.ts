/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database, getDatabase, ref, set, child, get, remove, update } from 'firebase/database';
import { initializeApp as Init } from 'firebase/app';

type Options = {
    apiKey: string;
    authDomain?: string;
    databaseURL: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}

function Create(options: Options) {
    try {
        if(global.connected) return getDatabase();

        global.connected = true;
        Init(options);
        return getDatabase();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.stack);
        }
    }
}

export class Firebase {
    db: Database;
    type: (path: string) => Promise<'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | Error>;
    sub: (path: string, number: number) => Promise<true | Error>;
    add: (path: string, number: number) => Promise<true | Error>;
    update: (path: string, value: any) => Promise<true | Error>;
    push: (path: string, value: any) => Promise<true | Error>;
    set: (path: string, value: any) => Promise<true | Error>;
    del: (path: string) => Promise<true | Error>;
    get: (path: string) => Promise<any>;
    ping: () => Promise<number | Error>;

    constructor(options: Options) {
        if(!global.connected && typeof options !== 'object') throw new TypeError('Options must be in object');
        if(!global.connected && !options.apiKey) throw new TypeError('The apiKey option is required');
        if(!global.connected && !options.databaseURL) throw new TypeError('The databaseURL option is required');

        this.db = Create(options);
        this.get = this.Get;
        this.set = this.Set;
        this.del = this.Del;
        this.add = this.Add;
        this.sub = this.Sub;
        this.push = this.Push;
        this.ping = this.Ping;
        this.type = this.Type;
        this.update = this.Update;
    }

    async Update(path: string, value: any) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        if(!value) return new Error('The value is necessary');

        update(ref(this.db, path), value);
        return true;
    }

    async Push(path: string, value: any) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        if(!value) return new Error('The value is necessary');

        const result = await this.Get(path);
        if(!Array.isArray(result)) return new Error('The path is not a array');
        result.push(value);

        await this.Set(path, result);
        return true;
    }

    async Add(path: string, number: number) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        if(!number) return new Error('The number is necessary');
        if(typeof number !== 'number') return new Error('This is not a number');
        const res = await this.Get(path);
        if(typeof res !== 'number') return new Error('The path not return a number');

        set(ref(this.db, path), res + number);
        return true;
    }

    async Sub(path: string, number: number) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        if(!number) return new Error('The number is necessary');
        if(typeof number !== 'number') return new Error('This is not a number');
        const res = await this.Get(path);
        if(typeof res !== 'number') return new Error('The path not return a number');

        if(res >= number) {
            set(ref(this.db, path), res - number);
        } else {
            set(ref(this.db, path), number - res);
        }

        return true;
    }

    async Set(path: string, value: any) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        if(!value) return new Error('The value is necessary');

        set(ref(this.db, path), value);
        return true;
    }

    async Type(path: string) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');

        const result = await this.Get(path);
        return typeof result;
    }

    async Get(path: string) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        const dbRef = ref(this.db);

        const result = await get(child(dbRef, path));
        return result.val();
    }

    async Del(path: string) {
        if(!this.db) return new Error('The database is not connected');
        if(!path) return new Error('The path is necessary');
        
        remove(ref(this.db, path));
        return true;
    }

    async Ping() {
        if(!this.db) return new Error('The database is not connected');
        const initial = process.hrtime();
        await this.Get('ping');
        const end = process.hrtime(initial);

        return Math.round(((end[0] * 1e9) + end[1]) / 1e6);
    }
}

export { getDatabase };