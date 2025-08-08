class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 🔍 Search by keyword in name
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // case-insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 🎯 Filtering (category, price, ratings)
filter() {
  const queryCopy = { ...this.queryStr };

  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => delete queryCopy[key]);

  const filterFields = {};

  // Price filter (convert to Number)
  if (queryCopy.price) {
    filterFields.price = {};
    if (queryCopy.price.gte) filterFields.price.$gte = Number(queryCopy.price.gte);
    if (queryCopy.price.lte) filterFields.price.$lte = Number(queryCopy.price.lte);
  }

  // Ratings filter (convert to Number)
  if (queryCopy.ratings) {
    filterFields.ratings = { $gte: Number(queryCopy.ratings) };
  }

  // Category filter (case-insensitive regex)
  if (queryCopy.category) {
    filterFields.category = {
      $regex: queryCopy.category.trim(),
      $options: "i",
    };
  }

  this.query = this.query.find(filterFields);

  console.log("Final Mongo filter:", filterFields);

  return this;
}





  // 📄 Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
