"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../services/AuthService");
class AuthController {
    async signup(req, res) {
        try {
            console.log(req.body, "req.body");
            const { name, email, password, tier } = req.body;
            const user = await AuthService_1.AuthService.findUser(email);
            if (user) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const result = await AuthService_1.AuthService.signup(name, email, password, tier);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = AuthController;
