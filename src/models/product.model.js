import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add product price"],
      min: [0, "Price cannot be negative"],
      set: (v) => Math.round(v * 100) / 100,
    },
    category: {
      type: String,
      required: [true, "Please add product category"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Product", productSchema);
