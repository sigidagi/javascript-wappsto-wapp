import WS from 'jest-websocket-mock';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);
import { Device, Value, ValueTemplate, config } from '../src/index';
import { openStream } from '../src/stream_helpers';

describe('device', () => {
    const response = {
        meta: {
            type: 'device',
            version: '2.0',
            id: 'b62e285a-5188-4304-85a0-3982dcb575bc',
        },
        name: 'test',
    };

    const response2Devices = [
        {
            meta: {
                type: 'device',
                version: '2.0',
                id: 'b62e285a-5188-4304-85a0-3982dcb575bc',
            },
            name: 'test',
        },
        {
            meta: {
                type: 'device',
                version: '2.0',
                id: '7c1611da-46e2-4f0d-85fa-1b010561b35d',
            },
            name: 'test',
        },
    ];

    const server = new WS('ws://localhost:12345', { jsonProtocol: true });

    beforeAll(() => {
        openStream.websocketUrl = 'ws://localhost:12345';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('can create a new device class', () => {
        const name = 'Test Device';
        const device = new Device(name);

        expect(device.name).toEqual(name);
    });

    it('can create a device on wappsto', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: response });

        const device = new Device('test');
        await device.create();

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device',
            {
                meta: {
                    type: 'device',
                    version: '2.0',
                },
                name: 'test',
            },
            {}
        );
        expect(device.name).toEqual('test');
        expect(device.values).toEqual([]);
        expect(device.meta.id).toEqual('b62e285a-5188-4304-85a0-3982dcb575bc');
    });

    it('can update a device on wappsto', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: response });
        mockedAxios.patch.mockResolvedValueOnce({ data: response });

        const device = new Device('test');
        await device.create();
        const oldName = response.name;
        response.name = 'new name';
        device.name = 'new name';
        await device.update();

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.patch).toHaveBeenCalledWith(
            '/2.0/device/' + device.meta.id,
            response,
            {}
        );

        response.name = oldName;
    });

    it('can create a new device from wappsto', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [response] });

        const devices = await Device.fetch();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: { expand: 3 },
        });
        expect(devices[0]?.name).toEqual('test');
    });

    it('can create a new device from wappsto with verbose', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [response] });

        config({ verbose: true });
        const devices = await Device.fetch();
        config({ verbose: false });

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: { expand: 3, verbose: true },
        });
        expect(devices[0]?.name).toEqual('test');
    });

    it('can find device by id', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [response] });

        const device = await Device.findById(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(device.name).toEqual('test');
        expect(device.toJSON).toBeDefined();

        expect(mockedAxios.get).toHaveBeenCalledWith(
            '/2.0/device/b62e285a-5188-4304-85a0-3982dcb575bc',
            {
                params: { expand: 3 },
            }
        );
    });

    it('can find a device by name', async () => {
        mockedAxios.get
            .mockResolvedValueOnce({ data: [] })
            .mockResolvedValueOnce({ data: [response] });

        const r = Device.findByName('test');
        await server.connected;

        server.send({
            meta_object: {
                type: 'notification',
            },
            path: '/notification/',
            data: {
                base: {
                    code: 1100004,
                    identifier: 'device-1-Find 1 device with name test',
                    ids: ['b62e285a-5188-4304-85a0-3982dcb575bc'],
                },
            },
        });

        const device = await r;

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                quantity: 1,
                message: 'Find 1 device with name test',
                identifier: 'device-1-Find 1 device with name test',
                this_name: '=test',
                method: ['retrieve', 'update'],
            },
        });
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                id: ['b62e285a-5188-4304-85a0-3982dcb575bc'],
                identifier: 'device-1-Find 1 device with name test',
                message: 'Find 1 device with name test',
                method: ['retrieve', 'update'],
                quantity: 1,
                this_name: '=test',
            },
        });
        expect(device[0].toJSON).toBeDefined();
        expect(device[0].meta.id).toEqual(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );
    });

    it('can find a device by product', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [response] });

        const devices = await Device.findByProduct('test');

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                this_product: '=test',
                identifier: 'device-1-Find 1 device with product test',
                message: 'Find 1 device with product test',
                quantity: 1,
                method: ['retrieve', 'update'],
            },
        });
        expect(devices[0].meta.id).toEqual(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );
    });

    const templateHelperStart = () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: '8d0468c2-ed7c-4897-ae87-bc17490733f7',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: 'd5ad7430-7948-47b5-ab85-c9a93d0bff5b',
                        },
                    },
                ],
            });
    };

    const templateHelperDone = () => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Report',
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Control',
            }),
            {}
        );
    };

    it('can create a value from a NUMBER template', async () => {
        templateHelperStart();

        const device = new Device();
        device.meta.id = '10483867-3182-4bb7-be89-24c2444cf8b7';
        const value = await device.createValue(
            'name',
            'rw',
            ValueTemplate.NUMBER,
            '0',
            2
        );

        templateHelperDone();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/10483867-3182-4bb7-be89-24c2444cf8b7/value',
            {
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'name',
                permission: 'rw',
                type: 'number',
                period: '0',
                delta: '2',
                number: {
                    min: -128,
                    max: 128,
                    step: 0.1,
                    unit: '',
                },
            },
            {}
        );

        expect(value.name).toEqual('name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('number');
        expect(value.number?.min).toEqual(-128);
        expect(value.number?.max).toEqual(128);
        expect(value.number?.step).toEqual(0.1);
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a value from a STRING template', async () => {
        templateHelperStart();

        const device = new Device();
        device.meta.id = '10483867-3182-4bb7-be89-24c2444cf8b7';
        const value = await device.createValue(
            'name',
            'rw',
            ValueTemplate.STRING
        );

        templateHelperDone();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/10483867-3182-4bb7-be89-24c2444cf8b7/value',
            {
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'name',
                permission: 'rw',
                period: '0',
                delta: '0',
                type: 'string',
                string: {
                    max: 64,
                    encoding: '',
                },
            },
            {}
        );

        expect(value.name).toEqual('name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('string');
        expect(value.string?.max).toEqual(64);
        expect(value.string?.encoding).toEqual('');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a value from a XML template', async () => {
        templateHelperStart();

        const device = new Device();
        device.meta.id = '10483867-3182-4bb7-be89-24c2444cf8b7';
        const value = await device.createValue('name', 'rw', ValueTemplate.XML);

        templateHelperDone();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/10483867-3182-4bb7-be89-24c2444cf8b7/value',
            {
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'name',
                permission: 'rw',
                period: '0',
                delta: '0',
                type: 'xml',
                xml: {
                    xsd: '',
                    namespace: '',
                },
            },
            {}
        );

        expect(value.name).toEqual('name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('xml');
        expect(value.xml?.xsd).toEqual('');
        expect(value.xml?.namespace).toEqual('');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a value from a BLOB template', async () => {
        templateHelperStart();

        const device = new Device();
        device.meta.id = '10483867-3182-4bb7-be89-24c2444cf8b7';
        const value = await device.createValue(
            'name',
            'rw',
            ValueTemplate.BLOB
        );

        templateHelperDone();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/10483867-3182-4bb7-be89-24c2444cf8b7/value',
            {
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'name',
                permission: 'rw',
                period: '0',
                delta: '0',
                type: 'blob',
                blob: {
                    max: 280,
                    encoding: 'base64',
                },
            },
            {}
        );

        expect(value.name).toEqual('name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('blob');
        expect(value.blob?.max).toEqual(280);
        expect(value.blob?.encoding).toEqual('base64');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a new number value as a child', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                        permission: '',
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: '8d0468c2-ed7c-4897-ae87-bc17490733f7',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: 'd5ad7430-7948-47b5-ab85-c9a93d0bff5b',
                        },
                    },
                ],
            });

        const device = new Device();
        device.meta.id = '35a99d31-b51a-4e20-ad54-a93e8eed21a3';
        const value = await device.createNumberValue({
            name: 'Value Name',
            permission: 'rw',
            type: 'type',
            delta: 'delta',
            min: 0,
            max: 1,
            step: 1,
            unit: 'unit',
            si_conversion: 'si_conversion',
        });

        expect(value.name).toEqual('Value Name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('type');
        expect(value.delta).toEqual('delta');
        expect(value.number?.min).toEqual(0);
        expect(value.number?.max).toEqual(1);
        expect(value.number?.step).toEqual(1);
        expect(value.number?.unit).toEqual('unit');
        expect(value.number?.si_conversion).toEqual('si_conversion');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/35a99d31-b51a-4e20-ad54-a93e8eed21a3/value',
            expect.objectContaining({
                permission: 'rw',
                type: 'type',
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'Value Name',
                delta: 'delta',
                number: {
                    min: 0,
                    max: 1,
                    step: 1,
                    unit: 'unit',
                    si_conversion: 'si_conversion',
                },
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Report',
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Control',
            }),
            {}
        );
    });

    it('can create a new string value as a child', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: '8d0468c2-ed7c-4897-ae87-bc17490733f7',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: 'd5ad7430-7948-47b5-ab85-c9a93d0bff5b',
                        },
                    },
                ],
            });

        const device = new Device();
        device.meta.id = '35a99d31-b51a-4e20-ad54-a93e8eed21a3';
        const value = await device.createStringValue({
            name: 'Value Name',
            permission: 'wr',
            type: 'type',
            delta: 'delta',
            max: 10,
            encoding: 'encoding',
        });

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/35a99d31-b51a-4e20-ad54-a93e8eed21a3/value',
            expect.objectContaining({
                permission: 'wr',
                type: 'type',
                period: '0',
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'Value Name',
                delta: 'delta',
                string: {
                    max: 10,
                    encoding: 'encoding',
                },
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Report',
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Control',
            }),
            {}
        );
        expect(value.name).toEqual('Value Name');
        expect(value.permission).toEqual('wr');
        expect(value.type).toEqual('type');
        expect(value.period).toEqual('0');
        expect(value.delta).toEqual('delta');
        expect(value.string?.max).toEqual(10);
        expect(value.string?.encoding).toEqual('encoding');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a new blob value as a child', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: '8d0468c2-ed7c-4897-ae87-bc17490733f7',
                        },
                    },
                ],
            });

        const device = new Device();
        device.meta.id = '35a99d31-b51a-4e20-ad54-a93e8eed21a3';
        const value = await device.createBlobValue({
            name: 'Value Name',
            permission: 'r',
            type: 'type',
            delta: 'delta',
            max: 10,
            encoding: 'encoding',
        });

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(2);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/35a99d31-b51a-4e20-ad54-a93e8eed21a3/value',
            expect.objectContaining({
                permission: 'r',
                type: 'type',
                period: '0',
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'Value Name',
                delta: 'delta',
                blob: {
                    max: 10,
                    encoding: 'encoding',
                },
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Report',
            }),
            {}
        );
        expect(value.name).toEqual('Value Name');
        expect(value.permission).toEqual('r');
        expect(value.type).toEqual('type');
        expect(value.period).toEqual('0');
        expect(value.delta).toEqual('delta');
        expect(value.blob?.max).toEqual(10);
        expect(value.blob?.encoding).toEqual('encoding');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can create a new xml value as a child', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'state',
                            version: '2.0',
                            id: '8d0468c2-ed7c-4897-ae87-bc17490733f7',
                        },
                    },
                ],
            });

        const device = new Device();
        device.meta.id = '35a99d31-b51a-4e20-ad54-a93e8eed21a3';
        const value = await device.createXmlValue({
            name: 'Value Name',
            permission: 'w',
            type: 'type',
            period: '0',
            delta: 'delta',
            xsd: 'xsd',
            namespace: 'namespace',
        });

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(2);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/35a99d31-b51a-4e20-ad54-a93e8eed21a3/value',
            expect.objectContaining({
                permission: 'w',
                type: 'type',
                period: '0',
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'Value Name',
                delta: 'delta',
                xml: {
                    xsd: 'xsd',
                    namespace: 'namespace',
                },
            }),
            {}
        );
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/value/f589b816-1f2b-412b-ac36-1ca5a6db0273/state',
            expect.objectContaining({
                meta: {
                    type: 'state',
                    version: '2.0',
                },
                data: '',
                type: 'Control',
            }),
            {}
        );
        expect(value.name).toEqual('Value Name');
        expect(value.permission).toEqual('w');
        expect(value.type).toEqual('type');
        expect(value.period).toEqual('0');
        expect(value.delta).toEqual('delta');
        expect(value.xml?.xsd).toEqual('xsd');
        expect(value.xml?.namespace).toEqual('namespace');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');
    });

    it('can return value as a child', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({
                data: [
                    {
                        permission: 'rw',
                        type: 'type',
                        period: '0',
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'f589b816-1f2b-412b-ac36-1ca5a6db0273',
                        },
                        name: 'Value Name',
                        delta: 'delta',
                        number: {
                            min: 0,
                            max: 1,
                            step: 1,
                            unit: 'unit',
                            si_conversion: 'si_conversion',
                        },
                    },
                ],
            })
            .mockResolvedValueOnce({ data: {} })
            .mockResolvedValueOnce({ data: {} });

        const device = new Device();
        device.meta.id = '61e94999-c6c4-4051-8b5d-97ba73bbb312';
        const val = new Value();
        val.name = 'Value Name';
        device.value.push(val);
        const value = await device.createNumberValue({
            name: 'Value Name',
            permission: 'rw',
            type: 'type',
            period: '0',
            delta: 'delta',
            min: 0,
            max: 1,
            step: 1,
            unit: 'unit',
            si_conversion: 'si_conversion',
        });

        expect(value.name).toEqual('Value Name');
        expect(value.permission).toEqual('rw');
        expect(value.type).toEqual('type');
        expect(value.period).toEqual('0');
        expect(value.delta).toEqual('delta');
        expect(value.number?.min).toEqual(0);
        expect(value.number?.max).toEqual(1);
        expect(value.number?.step).toEqual(1);
        expect(value.number?.unit).toEqual('unit');
        expect(value.number?.si_conversion).toEqual('si_conversion');
        expect(value.meta.id).toEqual('f589b816-1f2b-412b-ac36-1ca5a6db0273');

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
        expect(mockedAxios.post).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/2.0/device/61e94999-c6c4-4051-8b5d-97ba73bbb312/value',
            expect.objectContaining({
                permission: 'rw',
                type: 'type',
                period: '0',
                meta: {
                    type: 'value',
                    version: '2.0',
                },
                name: 'Value Name',
                delta: 'delta',
                number: {
                    min: 0,
                    max: 1,
                    step: 1,
                    unit: 'unit',
                    si_conversion: 'si_conversion',
                },
            }),
            {}
        );
    });

    it('can find all devices by name', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: response2Devices });

        const r = Device.findAllByName('test');
        const device = await r;

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                quantity: 'all',
                message: 'Find all device with name test',
                identifier: 'device-all-Find all device with name test',
                this_name: '=test',
                method: ['retrieve', 'update'],
            },
        });

        expect(device[0].toJSON).toBeDefined();
        expect(device[0].meta.id).toEqual(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );
        expect(device[1].meta.id).toEqual(
            '7c1611da-46e2-4f0d-85fa-1b010561b35d'
        );
    });

    it('can find all devices by product', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: response2Devices });

        const r = Device.findAllByProduct('test');
        const device = await r;

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                quantity: 'all',
                message: 'Find all device with product test',
                identifier: 'device-all-Find all device with product test',
                this_product: '=test',
                method: ['retrieve', 'update'],
            },
        });

        expect(device[0].toJSON).toBeDefined();
        expect(device[0].meta.id).toEqual(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );
        expect(device[1].meta.id).toEqual(
            '7c1611da-46e2-4f0d-85fa-1b010561b35d'
        );
    });

    it('can use custom find', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: response2Devices });

        const r = Device.find({ name: 'test' });
        const device = await r;

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/2.0/device', {
            params: {
                expand: 3,
                quantity: 1,
                message: 'Find 1 device',
                identifier: 'device-1-Find 1 device',
                this_name: '=test',
                method: ['retrieve', 'update'],
            },
        });

        expect(device[0].toJSON).toBeDefined();
        expect(device[0].meta.id).toEqual(
            'b62e285a-5188-4304-85a0-3982dcb575bc'
        );
    });

    it('can delete a value and make sure that it is not valid', async () => {
        mockedAxios.delete.mockResolvedValueOnce({ data: [] });
        mockedAxios.post
            .mockResolvedValueOnce({ data: [response] })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'b62e285a-5188-4304-85a0-3982dcb575bc',
                        },
                        name: 'Test Value',
                        permission: '',
                    },
                ],
            })
            .mockResolvedValueOnce({ data: [] })
            .mockResolvedValueOnce({
                data: [
                    {
                        meta: {
                            type: 'value',
                            version: '2.0',
                            id: 'b62e285a-5188-4304-85a0-3982dcb575bc',
                        },
                        name: 'Test Value',
                        permission: '',
                    },
                ],
            })
            .mockResolvedValueOnce({ data: [] });

        const device = new Device();
        await device.create();
        const val1 = await device.createValue(
            'Test Value',
            'r',
            ValueTemplate.NUMBER
        );
        await val1.delete();

        const val2 = await device.createValue(
            'Test Value',
            'r',
            ValueTemplate.NUMBER
        );

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledTimes(5);
        expect(mockedAxios.patch).toHaveBeenCalledTimes(0);

        expect(val1.name).toEqual('Test Value');
        expect(val2.name).toEqual('Test Value');

        expect(val1.meta.id).toEqual(undefined);
        expect(val2.meta.id).toEqual('b62e285a-5188-4304-85a0-3982dcb575bc');
    });

    it('can handle a value create', async () => {
        const f = jest.fn();
        mockedAxios.get.mockResolvedValueOnce({ data: [] });
        const d = new Device();
        d.meta.id = 'db6ba9ca-ea15-42d3-9c5e-1e1f50110f38';
        d.onCreate(f);

        await server.connected;

        server.send({
            meta_object: {
                type: 'event',
            },
            event: 'create',
            path: '/device/db6ba9ca-ea15-42d3-9c5e-1e1f50110f38/device',
            data: {
                meta: {
                    id: '60323236-54bf-499e-a438-608a24619c94',
                    type: 'value',
                },
                name: 'Value Name',
            },
        });

        expect(f).toHaveBeenCalledTimes(1);
        expect(d.value.length).toBe(1);
        expect(d.value[0].name).toEqual('Value Name');
        expect(d.value[0].toJSON).toBeDefined();
    });
});
