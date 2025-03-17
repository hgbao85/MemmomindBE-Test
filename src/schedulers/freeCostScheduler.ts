import cron from 'node-cron';
import UserModel from '../models/user.model';
import { UserRole } from '../models/user.model';

// Chạy cron job vào lúc 00:00 hàng ngày
cron.schedule('0 0 * * *', async () => {
  try {
    // Tìm tất cả người dùng và reset freeCost
    const users = await UserModel.find({ role: UserRole.FREE_VERSION });
    for (const user of users) {
      user.freeCost = 0;
      await user.save();
    }
    console.log('Free costs have been reset for all users in free version.');
  } catch (error) {
    console.error('Error resetting free costs:', error);
  }
});