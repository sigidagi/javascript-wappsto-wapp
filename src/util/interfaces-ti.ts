/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const IConfig = t.iface([], {
  "verbose": t.opt("boolean"),
  "debug": t.opt("boolean"),
  "validation": t.opt(t.union(t.lit('none'), t.lit('normal'), t.lit('strict'))),
  "reconnectCount": t.opt("number"),
});

export const IConfigFunc = t.iface([], {
  "config": t.func("IConfig", t.param("param", "IConfig")),
});

export const IModel = t.iface([], {
  "id": t.func("string"),
  "getUrl": t.func("string"),
  "removeChild": t.func("void", t.param("child", "IModel")),
});

export const IModelFunc = t.iface([], {
  "create": t.func("void", t.param("params", "any")),
  "fetch": t.func(t.array("any"), t.param("endpoint", "string"), t.param("params", "any", true), t.param("throwError", "boolean", true)),
  "parse": t.func("boolean", t.param("json", "any")),
});

export const IConnection = t.iface([], {
  "timestamp": "string",
  "online": "boolean",
});

export const IMeta = t.iface([], {
  "id": t.opt("string"),
  "type": t.opt("string"),
  "version": t.opt("string"),
  "redirect": t.opt("string"),
  "manufacturer": t.opt("string"),
  "iot": t.opt("boolean"),
  "upgradable": t.opt("boolean"),
  "connection": t.opt("IConnection"),
  "created": t.opt("string"),
  "updated": t.opt("string"),
  "revision": t.opt("number"),
  "changed": t.opt("string"),
  "owner": t.opt("string"),
  "size": t.opt("number"),
  "path": t.opt("string"),
  "parent": t.opt("string"),
  "usage_daily": t.opt("any"),
  "product": t.opt("string"),
  "deprecated": t.opt("boolean"),
  "icon": t.opt("string"),
  "trace": t.opt("string"),
});

export const INetwork = t.iface([], {
  "name": "string",
  "description": t.opt("string"),
});

export const INetworkFunc = t.iface([], {
  "constructor": t.func("void", t.param("name", "string", true)),
  "createNetwork": t.func("INetwork", t.param("params", "INetwork")),
  "findDeviceByName": t.func(t.array("IDevice"), t.param("name", "string")),
  "findDeviceByProduct": t.func(t.array("IDevice"), t.param("product", "string")),
  "findValueByName": t.func(t.array("IValue"), t.param("name", "string")),
  "findValueByType": t.func(t.array("IValue"), t.param("type", "string")),
  "createDevice": t.func("IDevice", t.param("params", "IDevice")),
  "find": t.func(t.array("INetwork"), t.param("params", "any"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findByName": t.func(t.array("INetwork"), t.param("name", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findAllByName": t.func(t.array("IDevice"), t.param("name", "string"), t.param("usage", "string")),
  "findById": t.func("INetwork", t.param("id", "string")),
  "fetch": t.func("IDevice", t.param("name", "string"), t.param("params", "any")),
});

export const IDevice = t.iface([], {
  "name": "string",
  "product": t.opt("string"),
  "serial": t.opt("string"),
  "description": t.opt("string"),
  "protocol": t.opt("string"),
  "communication": t.opt("string"),
  "version": t.opt("string"),
  "manufacturer": t.opt("string"),
});

export const IDeviceFunc = t.iface([], {
  "constructor": t.func("void", t.param("name", "string", true)),
  "findValueByName": t.func(t.array("IValue"), t.param("name", "string")),
  "findValueByType": t.func(t.array("IValue"), t.param("type", "string")),
  "createValue": t.func("IValue", t.param("name", "string"), t.param("permission", "ValuePermission"), t.param("valueTemplate", "IValueTemplate")),
  "createNumberValue": t.func("IValue", t.param("params", t.intersection("IValue", "IValueNumber"))),
  "createStringValue": t.func("IValue", t.param("params", t.intersection("IValue", "IValueString"))),
  "createBlobValue": t.func("IValue", t.param("params", t.intersection("IValue", "IValueBlob"))),
  "createXmlValue": t.func("IValue", t.param("params", t.intersection("IValue", "IValueXml"))),
  "find": t.func(t.array("IDevice"), t.param("params", "any"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findByName": t.func(t.array("IDevice"), t.param("name", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findAllByName": t.func(t.array("IDevice"), t.param("name", "string"), t.param("usage", "string")),
  "findByProduct": t.func(t.array("IDevice"), t.param("product", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findAllByProduct": t.func(t.array("IDevice"), t.param("product", "string"), t.param("usage", "string")),
  "findById": t.func("IDevice", t.param("id", "string")),
});

export const IPermissionModelFunc = t.iface([], {
  "request": t.func(t.array("any"), t.param("endpoint", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("message", "string"), t.param("params", "any", true)),
});

export const ValuePermission = t.union(t.lit('r'), t.lit('w'), t.lit('rw'), t.lit('wr'));

export const IValue = t.iface([], {
  "name": "string",
  "permission": "ValuePermission",
  "type": t.opt("string"),
  "period": t.opt("string"),
  "delta": t.opt("string"),
  "number": t.opt("IValueNumber"),
  "string": t.opt("IValueString"),
  "blob": t.opt("IValueBlob"),
  "xml": t.opt("IValueXml"),
});

export const IValueNumber = t.iface([], {
  "min": "number",
  "max": "number",
  "step": "number",
  "unit": t.opt("string"),
  "si_conversion": t.opt("string"),
  "mapping": t.opt("any"),
  "ordered_mapping": t.opt("boolean"),
  "meaningful_zero": t.opt("boolean"),
});

export const IValueString = t.iface([], {
  "max": "number",
  "encoding": t.opt("string"),
});

export const IValueBlob = t.iface([], {
  "max": "number",
  "encoding": t.opt("string"),
});

export const IValueXml = t.iface([], {
  "xsd": t.opt("string"),
  "namespace": t.opt("string"),
});

export const ValueTemplateType = t.union(t.lit('number'), t.lit('string'), t.lit('blob'), t.lit('xml'));

export const IValueTemplate = t.iface([], {
  "type": "string",
  "value_type": "ValueTemplateType",
  "number": t.opt("IValueNumber"),
  "string": t.opt("IValueString"),
  "blob": t.opt("IValueBlob"),
  "xml": t.opt("IValueXml"),
});

export const IValueFunc = t.iface([], {
  "constructor": t.func("IState", t.param("name", "string", true)),
  "createState": t.func("IState", t.param("params", "IState")),
  "report": t.func("void", t.param("data", t.union("string", "number")), t.param("timestamp", t.union("string", "undefined"))),
  "control": t.func("void", t.param("data", t.union("string", "number")), t.param("timestamp", t.union("string", "undefined"))),
  "onControl": t.func("void", t.param("callback", "ValueStreamCallback")),
  "onReport": t.func("void", t.param("callback", "ValueStreamCallback")),
  "onRefresh": t.func("void", t.param("callback", "RefreshStreamCallback")),
  "getReportLog": t.func("ILogResponse", t.param("request", "ILogRequest")),
  "getControlLog": t.func("ILogResponse", t.param("request", "ILogRequest")),
  "find": t.func(t.array("IValue"), t.param("params", "any"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findByName": t.func(t.array("IValue"), t.param("name", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findByType": t.func(t.array("IValue"), t.param("type", "string"), t.param("quantity", t.union("number", t.lit('all'))), t.param("usage", "string")),
  "findAllByName": t.func(t.array("IValue"), t.param("name", "string"), t.param("usage", "string")),
  "findAllByType": t.func(t.array("IValue"), t.param("type", "string"), t.param("usage", "string")),
  "findById": t.func("IValue", t.param("id", "string")),
});

export const StateType = t.union(t.lit('Report'), t.lit('Control'));

export const IState = t.iface([], {
  "type": "StateType",
  "data": t.opt("string"),
  "timestamp": t.opt("string"),
});

export const IStateFunc = t.iface([], {
  "constructor": t.func("IState", t.param("type", "StateType", true)),
});

export const INotificationCustomData = t.iface([], {
  "all": "boolean",
  "future": "boolean",
  "selected": t.array("any"),
});

export const INotificationCustom = t.iface([], {
  "type": "string",
  "quantity": "number",
  "limitation": t.array("any"),
  "method": t.array("any"),
  "option": "any",
  "message": "string",
  "name_installation": "string",
  "title_installation": t.union("string", "null"),
  "data": t.opt("INotificationCustomData"),
});

export const INotificationBase = t.iface([], {
  "action": "string",
  "code": "number",
  "type": "string",
  "from": "string",
  "to": "string",
  "from_type": "string",
  "from_name": "string",
  "to_type": "string",
  "type_ids": "string",
  "priority": "number",
  "ids": t.array("string"),
  "info": t.array("any"),
  "identifier": "string",
});

export const LogOperation = t.union(t.lit('arbitrary'), t.lit('array_agg'), t.lit('avg'), t.lit('mean'), t.lit('count'), t.lit('geometric_mean'), t.lit('max'), t.lit('min'), t.lit('sqrdiff'), t.lit('stddev'), t.lit('sum'), t.lit('variance'), t.lit('harmonic_mean'), t.lit('first'), t.lit('last'), t.lit('count_distinct'), t.lit('median'), t.lit('percentile'), t.lit('lower_quartile'), t.lit('upper_quartile'), t.lit('mode'));

export const LogGroupBy = t.union(t.lit('year'), t.lit('quarter'), t.lit('month'), t.lit('week'), t.lit('day'), t.lit('hour'), t.lit('minute'), t.lit('second'), t.lit('millisecond'), t.lit('microsecond'), t.lit('dow'), t.lit('doy'));

export const ILogRequest = t.iface([], {
  "start": t.opt("Date"),
  "end": t.opt("Date"),
  "limit": t.opt("number"),
  "offset": t.opt("number"),
  "operation": t.opt("LogOperation"),
  "group_by": t.opt("LogGroupBy"),
  "timestamp_format": t.opt("string"),
  "timezone": t.opt("string"),
  "order": t.opt(t.union(t.lit('ascending'), t.lit('descending'))),
  "order_by": t.opt("string"),
});

export const ILogResponse = t.iface([], {
  "meta": "IMeta",
  "data": "any",
  "more": "boolean",
  "type": "string",
});

export const EventType = t.union(t.lit('create'), t.lit('update'), t.lit('delete'), t.lit('direct'));

export const IStreamEvent = t.iface([], {
  "path": "string",
  "event": "EventType",
  "data": t.opt("any"),
  "meta_object": t.opt("IMeta"),
  "meta": t.opt("IMeta"),
  "extsync": t.opt("any"),
});

export const IStreamModel = t.iface([], {
  "path": t.func("string"),
  "handleStream": t.func("void", t.param("event", "IStreamEvent")),
});

export const IStreamFunc = t.iface([], {
  "subscribe": t.func("void", t.param("model", "IStreamModel")),
  "sendInternal": t.func("any", t.param("type", "string")),
  "subscribeInternal": t.func("void", t.param("type", "string"), t.param("handler", "ServiceHandler")),
  "subscribeService": t.func("void", t.param("service", "string"), t.param("handler", "ServiceHandler")),
  "addSignalHandler": t.func("void", t.param("type", "string"), t.param("handler", "SignalHandler")),
  "sendRequest": t.func("any", t.param("msg", "any")),
  "sendEvent": t.func("any", t.param("type", "string"), t.param("msg", "string")),
  "sendResponse": t.func("void", t.param("event", "any"), t.param("code", "number"), t.param("msg", "any")),
  "onRequest": t.func("void", t.param("handler", "RequestHandler"), t.param("internal", "boolean")),
});

export const OAuthRequestHandler = t.func("void", t.param("url", "string"));

export const IOAuthFunc = t.iface([], {
  "constructor": t.func("void", t.param("name", "string", true)),
  "getToken": t.func("void", t.param("handler", "OAuthRequestHandler", true)),
  "staticGetToken": t.func("void", t.param("name", "string"), t.param("handler", "OAuthRequestHandler", true)),
});

export const IWappStorageFunc = t.iface([], {
  "wappStorage": t.func("void", t.param("name", "string", true)),
  "constructor": t.func("void", t.param("name", "string")),
  "set": t.func("void", t.param("name", "string"), t.param("item", "any")),
  "get": t.func("any", t.param("name", "string")),
  "onChange": t.func("void", t.param("cb", "StorageChangeHandler")),
});

export const StorageChangeHandler = t.func("void");

export const SignalHandler = t.func("void", t.param("event", "string"));

export const ServiceHandler = t.func(t.union(t.union(t.lit(true), "undefined"), "boolean"), t.param("event", "any"));

export const RequestHandler = t.func("any", t.param("event", "any"));

export const StreamCallback = t.func("void", t.param("model", "IStreamModel"));

export const ValueStreamCallback = t.func("void", t.param("value", "IValue"), t.param("data", "string"), t.param("timestamp", "string"));

export const RefreshStreamCallback = t.func("void", t.param("value", "IValue"));

const exportedTypeSuite: t.ITypeSuite = {
  IConfig,
  IConfigFunc,
  IModel,
  IModelFunc,
  IConnection,
  IMeta,
  INetwork,
  INetworkFunc,
  IDevice,
  IDeviceFunc,
  IPermissionModelFunc,
  ValuePermission,
  IValue,
  IValueNumber,
  IValueString,
  IValueBlob,
  IValueXml,
  ValueTemplateType,
  IValueTemplate,
  IValueFunc,
  StateType,
  IState,
  IStateFunc,
  INotificationCustomData,
  INotificationCustom,
  INotificationBase,
  LogOperation,
  LogGroupBy,
  ILogRequest,
  ILogResponse,
  EventType,
  IStreamEvent,
  IStreamModel,
  IStreamFunc,
  OAuthRequestHandler,
  IOAuthFunc,
  IWappStorageFunc,
  StorageChangeHandler,
  SignalHandler,
  ServiceHandler,
  RequestHandler,
  StreamCallback,
  ValueStreamCallback,
  RefreshStreamCallback,
};
export default exportedTypeSuite;
