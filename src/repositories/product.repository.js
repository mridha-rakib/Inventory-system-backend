import Product from "../models/product.model.js";

class ProductRepository {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async getAllProducts({ filters, pagination }) {
    const query = {};

    if (filters.keyword && filters.keyword !== undefined) {
      query.$or = [
        { name: { $regex: filters.keyword, $options: "i" } },
        { Category: { $regex: filters.keyword, $options: "i" } },
      ];
    }

    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const [products, totalCount] = await Promise.all([
      Product.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      products,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip,
      },
    };
  }

  async update({ id, productData }) {
    return await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async count() {
    return await Product.countDocuments();
  }
}

export default ProductRepository;
