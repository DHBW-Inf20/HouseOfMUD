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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongoDB = require("mongodb");
var mongoose = require("mongoose");
var action_1 = require("./action");
var actionEvent_1 = require("./actionEvent");
var item_1 = require("./item");
//opening a connection to a database
var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/test");
//creating models (type safe collections) from predefined schemas
var itemModel = connection.model('Item', item_1.itemSchema);
var actionEventModel = connection.model("ActionEvent", actionEvent_1.actionEventSchema);
var actionModel = connection.model('ActionModel', action_1.actionSchema);
//TODO anlegen der models für alle Schemata
//creating documents inside those type safe collections
//if the document does not match the specified constraints, a ValidatorError is thrown
function createAndStoreObjects() {
    return __awaiter(this, void 0, void 0, function () {
        var testitem, testactionevent, testaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, itemModel.create({
                        name: "testname",
                        description: "testdesc"
                    })];
                case 1:
                    testitem = _a.sent();
                    return [4 /*yield*/, actionEventModel.create({
                            eventType: "addhp",
                            value: "3"
                        })];
                case 2:
                    testactionevent = _a.sent();
                    return [4 /*yield*/, actionModel.create({
                            command: "test",
                            output: "example output",
                            description: "this is an example action",
                            events: testactionevent,
                            itemsneeded: testitem
                        })];
                case 3:
                    testaction = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//query a document from a type save collection (by ID)
function getActionResult() {
    return __awaiter(this, void 0, void 0, function () {
        var actionresult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, actionModel.findOne(new mongoDB.ObjectId("62608678e25c3f84ddd4ecc6"))];
                case 1:
                    actionresult = _a.sent();
                    console.log(actionresult);
                    return [2 /*return*/];
            }
        });
    });
}
//query a referenced document inside another document from a type safe collection (by ID)
function getItemFromActionResult() {
    return __awaiter(this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, actionModel.findOne(new mongoDB.ObjectId("62608678e25c3f84ddd4ecc6")).populate('itemsneeded')];
                case 1:
                    action = _a.sent();
                    console.log(action.itemsneeded[0]);
                    return [2 /*return*/];
            }
        });
    });
}
//createAndStoreObjects();
//getActionResult();
getItemFromActionResult();
