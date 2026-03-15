import { Aggregate, Query, Schema } from 'mongoose';

const softDeletePlugin = (schema: Schema) => {
  // Add isDeleted field automatically
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });

  // Exclude deleted documents from find queries
  schema.pre(/^find/, function (this: Query<any, any>) {
    this.where({ isDeleted: { $ne: true } });
  });

  // Exclude deleted documents from aggregate
  schema.pre('aggregate', function (this: Aggregate<any>) {
    this.pipeline().unshift({
      $match: { isDeleted: { $ne: true } },
    });
  });
};

export default softDeletePlugin;
