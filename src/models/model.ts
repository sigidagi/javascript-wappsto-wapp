import * as _ from 'lodash';
import { plainToClass } from 'class-transformer';
import wappsto from '../util/http_wrapper';
import { printHttpError } from '../util/http_wrapper';
import { IMeta } from './meta';
import settings from '../util/settings';
import { StreamModel } from './model.stream';

interface IModel {
    getUrl(): string;
}

export class Model extends StreamModel implements IModel {
    meta: IMeta = {};
    parent?: IModel;

    constructor(type: string, version = '2.0') {
        super();
        this.meta.type = type;
        this.meta.version = version;
    }

    url(): string {
        return `/${this.meta.version}/${this.meta.type}`;
    }

    path(): string {
        if (this.meta.id) {
            return `/${this.meta.type}/${this.meta.id}`;
        } else {
            return `/${this.meta.type}`;
        }
    }

    attributes(): string[] {
        return [];
    }

    protected static generateOptions(params?: any, body?: any): any {
        let options: any = {
            params: {},
        };
        if (params) {
            Object.assign(options.params, params);
        }
        if (settings.verbose) {
            options.params['verbose'] = true;
        }
        if (body) {
            options['body'] = body;
        }
        if (Object.keys(options.params).length === 0) {
            options = _.omit(options, 'params');
        }
        return options;
    }

    public getUrl(): string {
        if (this.meta.id) {
            return this.url() + '/' + this.meta.id;
        } else if (this.parent) {
            return this.parent.getUrl() + '/' + this.meta.type;
        }
        return this.url();
    }

    public create = async (): Promise<void> => {
        try {
            let response = await wappsto.post(
                this.getUrl(),
                Model.generateOptions({}, this.toJSON())
            );
            this.parse(response.data);
        } catch (e) {
            printHttpError(e);
        }
    };

    public update = async (): Promise<void> => {
        try {
            let response = await wappsto.put(
                this.getUrl(),
                Model.generateOptions({}, this.toJSON())
            );
            this.parse(response.data);
        } catch (e) {
            printHttpError(e);
        }
    };

    public load = async (): Promise<void> => {
        try {
            let response = await wappsto.get(
                this.getUrl(),
                Model.generateOptions()
            );
            this.parse(response.data);
        } catch (e) {
            printHttpError(e);
        }
    };

    public static fetch = async (
        endpoint: string,
        params?: any
    ): Promise<any[]> => {
        try {
            let response = await wappsto.get(
                endpoint,
                Model.generateOptions(params)
            );

            if (_.isArray(response?.data)) {
                return response.data;
            } else if (response.data) {
                return [response.data];
            }
        } catch (e) {
            printHttpError(e);
        }
        return [];
    };

    parse(json: any): boolean {
        if (_.isArray(json)) {
            json = json[0];
        }
        let oldModel = this.toJSON();
        Object.assign(this, json);
        let newModel = this.toJSON();

        return !_.isEqual(oldModel, newModel);
    }

    static fromArray<T>(this: new () => T, json: any[]): T[] {
        return plainToClass(this, json);
    }

    toJSON(): any {
        let meta = Object.assign(
            {},
            _.pick(this.meta, ['id', 'type', 'version'])
        );
        return Object.assign({ meta: meta }, _.pick(this, this.attributes()));
    }
}
