"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = __importDefault(require("../controller/subscription"));
const router = express_1.default.Router();
router.post('/packages', subscription_1.default.createPackage);
router.get('/packages', subscription_1.default.getPackages);
router.post('/subscriptions/paid', subscription_1.default.createSubscription);
router.get('/subscriptions/:userId', subscription_1.default.getUserSubscription);
router.put('/subscriptions/:userId', subscription_1.default.updateUserSubscription);
router.delete('/subscriptions/:userId', subscription_1.default.cancelSubscription);
exports.default = router;
