"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
const subscriptions_table_2 = __importDefault(require("../model/subscriptions_table"));
const users_models_1 = __importDefault(require("../model/users_models"));
class SubscriptionService {
    async createPackage(packageData) {
        try {
            const newPackage = await subscriptions_table_1.default.create(packageData);
            return newPackage;
        }
        catch (error) {
            throw new Error(`Error creating package: ${error.message}`);
        }
    }
    async getPackages() {
        try {
            const packages = await subscriptions_table_1.default.findAll({
                where: { is_deleted: false, is_active: true },
            });
            return packages;
        }
        catch (error) {
            throw new Error(`Error fetching packages: ${error.message}`);
        }
    }
    async createSubscription(subscriptionData) {
        try {
            const newSubscription = await subscriptions_table_2.default.create(subscriptionData);
            return newSubscription;
        }
        catch (error) {
            throw new Error(`Error creating subscription: ${error.message}`);
        }
    }
    async getUserSubscription(userId) {
        try {
            const subscription = await subscriptions_table_2.default.findOne({
                where: { user_id: userId, is_deleted: false },
                include: [{ model: subscriptions_table_1.default, as: 'package' }],
            });
            return subscription;
        }
        catch (error) {
            throw new Error(`Error fetching user subscription: ${error.message}`);
        }
    }
    async updateUserSubscription(userId, subscriptionData) {
        try {
            const [updatedRowsCount, updatedSubscriptions] = await subscriptions_table_2.default.update(subscriptionData, {
                where: { user_id: userId, is_deleted: false },
                returning: true,
            });
            if (updatedRowsCount === 0) {
                throw new Error('No subscription found for the user');
            }
            return updatedSubscriptions[0];
        }
        catch (error) {
            throw new Error(`Error updating user subscription: ${error.message}`);
        }
    }
    async cancelSubscription(userId) {
        try {
            const subscription = await subscriptions_table_2.default.findOne({
                where: { user_id: userId, is_deleted: false },
            });
            if (!subscription) {
                throw new Error('No active subscription found for the user');
            }
            subscription.status = 'cancelled';
            subscription.is_deleted = true;
            await subscription.save();
            return subscription;
        }
        catch (error) {
            throw new Error(`Error cancelling subscription: ${error.message}`);
        }
    }
    async getPackageByReference(reference) {
        try {
            const package_ = await subscriptions_table_1.default.findOne({
                where: { package_reference: reference, is_deleted: false, is_active: true },
            });
            return package_;
        }
        catch (error) {
            throw new Error(`Error fetching package by reference: ${error.message}`);
        }
    }
    async getUserById(userId) {
        try {
            const user = await users_models_1.default.findByPk(userId);
            return user;
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }
    async getPackageById(packageId) {
        try {
            const package_ = await subscriptions_table_1.default.findByPk(packageId);
            return package_;
        }
        catch (error) {
            throw new Error(`Error fetching package: ${error.message}`);
        }
    }
    async createPaidSubscription(userId, packageId, stripeSubscriptionId) {
        try {
            const user = await this.getUserById(userId);
            const package_ = await this.getPackageById(packageId);
            if (!user || !package_) {
                throw new Error('User or package not found');
            }
            const subscription = await this.createSubscription({
                user_id: user.id,
                email: user.email,
                //   package_title: package_.title,
                package_reference: package_.package_reference,
                package_id: package_.id,
                subscription_id: stripeSubscriptionId,
                mode: 'paid',
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now, adjust as needed
                //   paid_amount: package_.yearly_per_month_charges * 12, // Assuming yearly subscription, adjust as needed
                payment_status: 'paid',
                status: 'active',
            });
            return subscription;
        }
        catch (error) {
            throw new Error(`Error creating paid subscription: ${error.message}`);
        }
    }
}
exports.default = new SubscriptionService();
