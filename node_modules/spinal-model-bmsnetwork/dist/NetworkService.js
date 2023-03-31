"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_model_timeseries_1 = require("spinal-model-timeseries");
exports.SpinalServiceTimeseries = spinal_model_timeseries_1.SpinalServiceTimeseries;
exports.SpinalTimeSeries = spinal_model_timeseries_1.SpinalTimeSeries;
exports.SpinalTimeSeriesArchive = spinal_model_timeseries_1.SpinalTimeSeriesArchive;
exports.SpinalTimeSeriesArchiveDay = spinal_model_timeseries_1.SpinalTimeSeriesArchiveDay;
const InputDataModel_1 = require("./InputDataModel/InputDataModel");
exports.InputDataEndpointDataType = InputDataModel_1.InputDataEndpointDataType;
exports.InputDataEndpointType = InputDataModel_1.InputDataEndpointType;
const SpinalBms_1 = require("./SpinalBms");
exports.SpinalBmsDevice = SpinalBms_1.SpinalBmsDevice;
exports.SpinalBmsEndpoint = SpinalBms_1.SpinalBmsEndpoint;
exports.SpinalBmsEndpointGroup = SpinalBms_1.SpinalBmsEndpointGroup;
exports.SpinalBmsNetwork = SpinalBms_1.SpinalBmsNetwork;
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const throttle = require('lodash.throttle');
/**
 * @export
 * @class NetworkService
 */
class NetworkService {
    /**
     *Creates an instance of NetworkService.
     * @memberof NetworkService
     */
    constructor(useTimeseries = true) {
        this.spinalServiceTimeseries = new spinal_model_timeseries_1.SpinalServiceTimeseries();
        this.useTimeseries = useTimeseries;
        this.useDelay = 0;
    }
    setupDelay(timeout) {
        this.useDelay = timeout;
    }
    /**
     * @param {spinal.Model} forgeFile
     * @param {ConfigService} configService
     * @param {boolean} [autoCreate=true]
     * @returns {Promise<{contextId:string, networkId: string}>}
     * @memberof NetworkService
     */
    init(forgeFile, configService, autoCreate = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(forgeFile);
            this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(configService.contextName);
            if (this.context === undefined) {
                if (autoCreate === true) {
                    this.context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(configService.contextName, configService.contextType, new spinal_core_connectorjs_type_1.Model());
                }
                else {
                    throw Error(`Context named "${configService.contextName}" is not found in the graph.`);
                }
            }
            this.contextId = this.context.getId().get();
            const childrenContext = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(this.contextId, this.contextId);
            let childFoundId = '';
            for (const childContext of childrenContext) {
                if (typeof childContext.networkName !== 'undefined' &&
                    childContext.networkName.get() === configService.networkName) {
                    childFoundId = childContext.id.get();
                    break;
                }
            }
            if (childFoundId === '') {
                childFoundId = yield this
                    .createNewBmsNetwork(this.contextId, configService.networkType, configService.networkName)
                    .then(res => res.id.get());
            }
            this.networkId = childFoundId;
            return { contextId: this.contextId, networkId: childFoundId };
        });
    }
    /**
     * @param {string} parentId
     * @param {string} typeName
     * @param {string} networkName
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsNetwork(parentId, typeName, networkName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new SpinalBms_1.SpinalBmsNetwork(networkName, typeName);
            const tmpInfo = {
                networkName,
                typeName,
                type: SpinalBms_1.SpinalBmsNetwork.nodeTypeName,
                name: networkName,
                idNetwork: res.id.get(),
            };
            const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(tmpInfo, res);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, childId, this.contextId, SpinalBms_1.SpinalBmsNetwork.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(childId);
        });
    }
    /**
     * @param {string} parentId
     * @param {InputDataDevice} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsDevice(parentId, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new SpinalBms_1.SpinalBmsDevice(obj.name, obj.type, obj.path, obj.id);
            const tmpInfo = {
                type: SpinalBms_1.SpinalBmsDevice.nodeTypeName,
                name: obj.name,
                idNetwork: obj.id,
            };
            const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(tmpInfo, res);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, childId, this.contextId, SpinalBms_1.SpinalBmsDevice.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            yield this._createAttributes(childId, res);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(childId);
        });
    }
    /**
     * @param {string} parentId
     * @param {InputDataEndpointGroup} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpointGroup(parentId, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new SpinalBms_1.SpinalBmsEndpointGroup(obj.name, obj.type, obj.path, obj.id);
            const tmpInfo = {
                type: SpinalBms_1.SpinalBmsEndpointGroup.nodeTypeName,
                name: obj.name,
                idNetwork: obj.id,
            };
            const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(tmpInfo, res);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, childId, this.contextId, SpinalBms_1.SpinalBmsEndpointGroup.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            yield this._createAttributes(childId, res);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(childId);
        });
    }
    /**
     * @param {string} parentId
     * @param {InputDataEndpoint} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpoint(parentId, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new SpinalBms_1.SpinalBmsEndpoint(obj.name, obj.path, obj.currentValue, obj.unit, InputDataModel_1.InputDataEndpointDataType[obj.dataType], InputDataModel_1.InputDataEndpointType[obj.type], obj.id);
            const tmpInfo = {
                type: SpinalBms_1.SpinalBmsEndpoint.nodeTypeName,
                name: obj.name,
                idNetwork: obj.id,
            };
            const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(tmpInfo, res);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, childId, this.contextId, SpinalBms_1.SpinalBmsEndpoint.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            yield this._createAttributes(childId, res);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(childId);
        });
    }
    /**
     * @param {InputDataDevice} obj
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateData(obj, date = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextChildren = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(this.networkId, this.contextId);
            for (const child of contextChildren) {
                if (typeof child.idNetwork !== 'undefined' &&
                    child.idNetwork.get() === obj.id) {
                    return this.updateModel(child, obj, date);
                }
            }
            return this.createNewBmsDevice(this.networkId, obj).then((child) => {
                return this.updateModel(child, obj, date);
            });
        });
    }
    /**
     * @private
     * @param {*} node
     * @param {(InputDataDevice|InputDataEndpointGroup)} reference
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateModel(node, reference, date = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextChildren = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(node.id.get(), this.contextId);
            const notPresent = [];
            const promises = [];
            for (const refChild of reference.children) {
                let childFound = false;
                for (const child of contextChildren) {
                    if (child.idNetwork.get() === refChild.id) {
                        switch (child.type.get()) {
                            case SpinalBms_1.SpinalBmsDevice.nodeTypeName:
                                promises.push(this.updateModel(child, refChild, date));
                                childFound = true;
                                break;
                            case SpinalBms_1.SpinalBmsEndpointGroup.nodeTypeName:
                                promises.push(this.updateModel(child, refChild, date));
                                childFound = true;
                                break;
                            case SpinalBms_1.SpinalBmsEndpoint.nodeTypeName:
                                promises.push(this.updateEndpoint(child, refChild, date));
                                childFound = true;
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (!childFound) {
                    notPresent.push(refChild);
                }
            }
            let prom;
            for (const item of notPresent) {
                switch (item.nodeTypeName) {
                    case SpinalBms_1.SpinalBmsDevice.nodeTypeName:
                        prom = this.createNewBmsDevice(node.id.get(), (item))
                            .then((child) => {
                            return this.updateModel(child, item, date);
                        });
                        promises.push(prom);
                        break;
                    case SpinalBms_1.SpinalBmsEndpointGroup.nodeTypeName:
                        prom = this.createNewBmsEndpointGroup(node.id.get(), item)
                            .then((child) => {
                            return this.updateModel(child, item, date);
                        });
                        promises.push(prom);
                        break;
                    case SpinalBms_1.SpinalBmsEndpoint.nodeTypeName:
                        prom =
                            this.createNewBmsEndpoint(node.id.get(), (item))
                                .then((child) => {
                                return this.updateEndpoint(child, item, date);
                            });
                        promises.push(prom);
                        break;
                    default:
                        break;
                }
            }
            yield Promise.all(promises);
        });
    }
    /**
     * @param {*} node
     * @param {InputDataEndpoint} reference
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateEndpoint(node, reference, date = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield node.element.load();
            // await this._createAttributes(node.id.get(), element);
            element.currentValue.set(reference.currentValue);
            if (typeof reference.currentValue === 'number' ||
                typeof reference.currentValue === 'boolean') {
                yield this.setEndpointValue(node.id.get(), reference.currentValue, date);
            }
        });
    }
    /**
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const childrenContext = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(this.contextId, this.contextId);
            return childrenContext.map(element => element.id.get());
        });
    }
    /**
     * @private
     * @param {string} idElement
     * @param {string[]} relationNames
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    find(idElement, relationNames, nodeTypeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(idElement);
            const childrenContext = yield node.find(relationNames, (node) => {
                if (node.getType().get() === nodeTypeName) {
                    return true;
                }
                return false;
            });
            return childrenContext.map((element) => {
                // hack, call private method while 'find' is not in service
                const graphs = spinal_env_viewer_graph_service_1.SpinalGraphService;
                graphs._addNode(element);
                return element.getId().get();
            });
        });
    }
    /**
     * @param {string} idDevice
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getEndpoint(idDevice) {
        const relationNames = [
            SpinalBms_1.SpinalBmsEndpointGroup.relationName,
            SpinalBms_1.SpinalBmsEndpoint.relationName,
        ];
        return this.find(idDevice, relationNames, SpinalBms_1.SpinalBmsEndpoint.nodeTypeName);
    }
    getDevices(idNetwork) {
        const relationNames = [
            SpinalBms_1.SpinalBmsDevice.relationName,
            SpinalBms_1.SpinalBmsEndpointGroup.relationName,
            SpinalBms_1.SpinalBmsEndpoint.relationName,
        ];
        return this.find(idNetwork, relationNames, SpinalBms_1.SpinalBmsDevice.nodeTypeName);
    }
    /**
     * @param {string} idNode
     * @returns {spinal.Model}
     * @memberof NetworkService
     */
    getInfo(idNode) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(idNode);
    }
    /**
     * @param {string} idNode
     * @returns {Promise<spinal.Model>}
     * @memberof NetworkService
     */
    getData(idNode) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(idNode).element.load();
    }
    /**
     * @param {string} idEndpoint
     * @returns {Promise<SpinalTimeSeries>}
     * @memberof NetworkService
     */
    getTimeseries(idEndpoint) {
        return this.spinalServiceTimeseries.getOrCreateTimeSeries(idEndpoint);
    }
    /**
     * @param {string} idEndpoint
     * @param {(string|boolean|number)} value
     * @param {(number|string|Date)} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    setEndpointValue(idEndpoint, value, date = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(idEndpoint);
            const element = (yield node.element.load());
            element.currentValue.set(value);
            if (this.useTimeseries === true && (typeof value === 'number' || typeof value === 'boolean')) {
                if (this.useDelay === 0) {
                    return pushData(this.spinalServiceTimeseries, idEndpoint, (element.currentValue), date);
                }
                if (dicEnd.has(idEndpoint)) {
                    const fct = dicEnd.get(idEndpoint);
                    fct(this.spinalServiceTimeseries, idEndpoint, element.currentValue, date);
                }
                else {
                    const fct = throttle(pushData, 3 * 60 * 1000);
                    dicEnd.set(idEndpoint, fct);
                    fct(this.spinalServiceTimeseries, idEndpoint, element.currentValue, date);
                }
                // if (date === null) {
                //   return this.spinalServiceTimeseries.pushFromEndpoint(idEndpoint, value);
                // }
                // return this.spinalServiceTimeseries.insertFromEndpoint(
                //     idEndpoint,
                //     value,
                //     new Date(date),
                // );
            }
        });
    }
    _createAttributes(nodeId, elementModel) {
        const categoryName = "default";
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        return spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addCategoryAttribute(realNode, categoryName).then((attributeCategory) => {
            const promises = [];
            for (const key of elementModel._attribute_names) {
                promises.push(spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addAttributeByCategory(realNode, attributeCategory, key, elementModel[key]));
            }
            return Promise.all(promises);
        }).catch((err) => {
        });
    }
}
exports.NetworkService = NetworkService;
const dicEnd = new Map();
function pushData(spinalServiceTimeseries, idEndpoint, value, date) {
    if (date === null) {
        return spinalServiceTimeseries.pushFromEndpoint(idEndpoint, value.get());
    }
    return spinalServiceTimeseries.insertFromEndpoint(idEndpoint, value.get(), new Date(date));
}
exports.default = NetworkService;
//# sourceMappingURL=NetworkService.js.map