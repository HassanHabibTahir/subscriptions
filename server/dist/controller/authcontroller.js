"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../services/AuthService");
class AuthController {
    async signup(req, res) {
        try {
            const body = req.body;
            const user = await AuthService_1.AuthService.findUser(body?.email);
            if (user) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const result = await AuthService_1.AuthService.signup(body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = AuthController;
