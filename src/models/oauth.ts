import { Model } from './model';
import { openStream } from './stream';
import { printDebug } from '../util/debug';

export class OAuth extends Model {
    static endpoint = '/2.0/oauth_connect';

    name: string;
    api?: string;
    installation?: string;
    token?: string;
    secret_token?: string;
    params?: Record<string, any>;

    constructor(name: string) {
        super('2.0', 'oauth');
        Model.validateMethod('OAuth', 'constructor', arguments);
        this.name = name;
    }

    public getToken = async () => {
        return new Promise<Record<string, any>>(async (resolve, reject) => {
            let data = await Model.fetch(`/2.0/oauth_connect/${this.name}`, {});
            let oauth = data[0];

            if (oauth?.params?.oauth_token) {
                resolve(oauth?.params);
                return;
            }

            /* istanbul ignore next */
            if (typeof process !== 'object') {
                reject(oauth?.data?.request);
                return;
            }

            printDebug('OAuth token is not valid, waiting for token on stream');
            openStream.subscribeService(
                '/oauth_connect',
                async (
                    event: Record<string, any>
                ): Promise<true | undefined> => {
                    if (event?.data?.name === this.name) {
                        printDebug('Got OAuth token from stream');
                        resolve(event?.data?.params);
                        return true;
                    }
                    return;
                }
            );
        });
    };

    static getToken = async (name: string) => {
        OAuth.validate('getToken', [name]);
        let oauth = new OAuth(name);
        return await oauth.getToken();
    };

    private static validate(name: string, params: any): void {
        Model.validateMethod('OAuth', name, params);
    }
}
