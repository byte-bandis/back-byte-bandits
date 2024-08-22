class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      this.query.sort(this.queryString.sort);
    }else{
      this.query.sort('-createdAt');

    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = parseInt(this.queryString.page) || 1;
      const limit = parseInt(this.queryString.limit) || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'minPrice', 'maxPrice'];
    excludedFields.forEach((excFields) => delete queryObj[excFields]);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    console.log("filter")
    this.query = this.query.find(JSON.parse(queryStr));

    console.log("Final Query:", this.query.getQuery())

    return this;
  }

  searchByTitle() {
    console.log("searchByTitle")
    if (this.queryString.adTitle) {
      const regex = new RegExp(this.queryString.adTitle, 'i'); 
      this.query = this.query.find({ adTitle: regex });
      console.log("Search by title:", this.queryString.adTitle);
    }
    return this;
  }

  filterByTags() {
    if (this.queryString.tags) {
      const tags = this.queryString.tags.split(",");
      this.query = this.query.find({ tags: { $in: tags } });
      console.log("Filter by tags:", tags);
    }
    return this;
  }

  filterByPriceRange() {
    console.log("filterByPriceRange");
    const { minPrice, maxPrice } = this.queryString;
  
    if (minPrice || maxPrice) {
      const priceFilter = {};
  
      if (minPrice) {
        priceFilter.$gte = parseFloat(minPrice);
      }
  
      if (maxPrice) {
        priceFilter.$lte = parseFloat(maxPrice);
      }
  
      this.query = this.query.find({ price: priceFilter });
      console.log("Filter by price:", priceFilter);
    }
    return this;
  }
  

  filterByIsBuy() {
    if (this.queryString.isBuy !== undefined) {
      const isBuy = this.queryString.isBuy === "true";
      this.query = this.query.find({ sell: isBuy });
      console.log("Filter by isBuy:", isBuy);
    }
    return this;
  }
}

module.exports = APIFeatures;
