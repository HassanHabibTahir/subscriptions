"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontroller_1 = __importDefault(require("../controller/authcontroller"));
const router = (0, express_1.Router)();
const authController = new authcontroller_1.default();
router.post("/signup", authController.signup.bind(authController));
exports.default = router;
