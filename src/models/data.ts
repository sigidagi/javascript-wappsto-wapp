import { isArray, isEqual, pick, omit } from 'lodash';
import { Model } from './model';

interface IDataMeta {
    id?: string;
    type?: string;
}

export class Data extends Model {
    static endpoint = '/2.0/data';
    data_meta: IDataMeta = {};
    data?: any = {};

    constructor(id?: string, type?: string) {
        super('data', '2.0');

        this.data_meta.type = type;
        this.data_meta.id = id;
    }

    url(): string {
        return Data.endpoint;
    }

    attributes(): string[] {
        return ['meta', 'data_meta'];
    }

    set(name: string, item: any): void {
        this.data[name] = item;
    }

    get(name: string): any {
        return this.data[name];
    }

    public static findByDataId = async (id: string) => {
        const json: any[] = await Model.fetch(Data.endpoint, {
            'this_data_meta.id': id,
            expand: 1,
        });

        const res: Data[] = [];
        json.forEach((item) => {
            const data = new Data();
            data.parse(item);
            res.push(data);
        });
        return res;
    };

    public parse(json: Record<string, any>): boolean {
        Model.validateMethod('Model', 'parse', arguments);
        if (isArray(json)) {
            json = json[0];
        }
        const oldModel = this.toJSON();
        Object.assign(this, pick(json, this.attributes()));
        Object.assign(this.data, omit(json, this.attributes()));
        const newModel = this.toJSON();

        return !isEqual(oldModel, newModel);
    }

    public toJSON(): Record<string, any> {
        const obj = super.toJSON();
        return Object.assign(obj, this.data);
    }
}
