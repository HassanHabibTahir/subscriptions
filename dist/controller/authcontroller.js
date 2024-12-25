"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthController {
    async signup(req, res) {
        try {
            const { name, email, password, tier } = req.body;
            //   // Create user
            //   const user = await User.create({
            //     name,
            //     email,
            //     password, // Note: In a real application, you should hash the password
            //     tier,
            //     type: 'user',
            //     username: email, // Using email as username for simplicity
            //     display_name: name,
            //   });
            //   if (tier === 'free') {
            //     // If free tier, create a free subscription
            //     const freePackage = await SubscriptionService.getPackageByReference('free');
            //     if (!freePackage) {
            //       throw new Error('Free package not found');
            //     }
            //     await SubscriptionService.createSubscription({
            //       user_id: user.id,
            //       email: user.email,
            //       package_title: freePackage.title,
            //       package_reference: freePackage.package_reference,
            //       package_id: freePackage.id,
            //       subscription_id: '', // Empty for free tier
            //       mode: 'free',
            //       expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            //       paid_amount: 0,
            //       payment_status: 'free',
            //       status: 'active',
            //     });
            //     return res.status(201).json({
            //       message: 'User created successfully with free tier',
            //       userId: user.id,
            //     });
            //   } else {
            //     // If the selected tier is not free, only create the user
            //     return res.status(200).json({
            //       message: 'User created successfully. Subscription required.',
            //       userId: user.id,
            //     });
            //   }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = new AuthController();
