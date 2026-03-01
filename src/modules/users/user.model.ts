import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
import { USER_ROLES, USER_STATUS } from './user.constant';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
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

// Check if JWT issued before password change
userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  if (!passwordChangedTimeStamp) return false;

  const passwordChangedTime = Math.floor(
    new Date(passwordChangedTimeStamp).getTime() / 1000,
  );

  return passwordChangedTime > jwtIssuedTimeStamp;
};

export const User = model<IUser, UserModel>('User', userSchema);
