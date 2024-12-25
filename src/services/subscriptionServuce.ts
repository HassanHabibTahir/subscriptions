import PackageTableContent from '../model/subscriptions_table';
import Subscription from '../model/subscriptions_table';
import User from '../model/users_models';

class SubscriptionService {
    async createPackage(packageData: Partial<PackageTableContent>) {
      try {
        const newPackage = await PackageTableContent.create(packageData);
        return newPackage;
      } catch (error) {
        throw new Error(`Error creating package: ${error.message}`);
      }
    }
  
    async getPackages() {
      try {
        const packages = await PackageTableContent.findAll({
          where: { is_deleted: false, is_active: true },
        });
        return packages;
      } catch (error) {
        throw new Error(`Error fetching packages: ${error.message}`);
      }
    }
  
    async createSubscription(subscriptionData: Partial<Subscription>) {
      try {
        const newSubscription = await Subscription.create(subscriptionData);
        return newSubscription;
      } catch (error) {
        throw new Error(`Error creating subscription: ${error.message}`);
      }
    }
  
    async getUserSubscription(userId: number) {
      try {
        const subscription = await Subscription.findOne({
          where: { user_id: userId, is_deleted: false },
          include: [{ model: PackageTableContent, as: 'package' }],
        });
        return subscription;
      } catch (error) {
        throw new Error(`Error fetching user subscription: ${error.message}`);
      }
    }
  
    async updateUserSubscription(userId: number, subscriptionData: Partial<Subscription>) {
      try {
        const [updatedRowsCount, updatedSubscriptions] = await Subscription.update(subscriptionData, {
          where: { user_id: userId, is_deleted: false },
          returning: true,
        });
  
        if (updatedRowsCount === 0) {
          throw new Error('No subscription found for the user');
        }
  
        return updatedSubscriptions[0];
      } catch (error) {
        throw new Error(`Error updating user subscription: ${error.message}`);
      }
    }
  
    async cancelSubscription(userId: number) {
      try {
        const subscription = await Subscription.findOne({
          where: { user_id: userId, is_deleted: false },
        });
  
        if (!subscription) {
          throw new Error('No active subscription found for the user');
        }
  
        subscription.status = 'cancelled';
        subscription.is_deleted = true;
        await subscription.save();
  
        return subscription;
      } catch (error) {
        throw new Error(`Error cancelling subscription: ${error.message}`);
      }
    }
  
    async getPackageByReference(reference: string) {
      try {
        const package_ = await PackageTableContent.findOne({
          where: { package_reference: reference, is_deleted: false, is_active: true },
        });
        return package_;
      } catch (error) {
        throw new Error(`Error fetching package by reference: ${error.message}`);
      }
    }
  
    async getUserById(userId: number) {
      try {
        const user = await User.findByPk(userId);
        return user;
      } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }
    }
  
    async getPackageById(packageId: number) {
      try {
        const package_ = await PackageTableContent.findByPk(packageId);
        return package_;
      } catch (error) {
        throw new Error(`Error fetching package: ${error.message}`);
      }
    }
  
    async createPaidSubscription(userId: number, packageId: number, stripeSubscriptionId: string) {
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
      } catch (error) {
        throw new Error(`Error creating paid subscription: ${error.message}`);
      }
    }
  }
export default new SubscriptionService();

