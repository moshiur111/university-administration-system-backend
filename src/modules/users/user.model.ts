import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { USER_ROLES, USER_STATUS } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: `Status must be one of: ${Object.values(USER_STATUS).join(
          ', ',
        )}`,
      },
      default: USER_STATUS.IN_PROGRESS,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password befor save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
});

// Check if user exists by custom ID
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return this.findOne({ id }).select('+password');
};

// Check if use is deleted
userSchema.statics.isUserDeleted = async function (id: string) {
  const user = await this.isUserExistsByCustomId(id);
  return Boolean(user?.isDeleted);
};

// Get user status
userSchema.statics.userStatus = async function (id: string) {
  const user = await this.isUserExistsByCustomId(id);
  return user?.status === USER_STATUS.BLOCKED;
};

// Static method for password comparison
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
