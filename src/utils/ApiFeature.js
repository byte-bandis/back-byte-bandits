class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy;

      console.log("que e2", this.queryString.sort)
      if(Array.isArray(this.queryString.sort)) { 
      sortBy = this.queryString.sort.map(field => {
          return field.startsWith("-") ? [field.substring(1), "desc"] : [field, "asc"]
        })
      }
      else if(typeof this.queryString.sort === "string"){
        sortBy = [[this.queryString.sort.startsWith('-') ? 
          this.queryString.sort.substring(1) : 
          this.queryString.sort, this.queryString.sort.startsWith('-') ?
          'desc' : 'asc']];
      }
  
      const sortObject = Object.fromEntries(sortBy);
      this.query = this.query.sort(sortObject);

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
    console.log("searchByTitle");
    if (this.queryString.adTitle) {
      const queryOptions = {
        locale: 'es', 
        strength: 1   
      };
  
      this.query = this.query.find({
        adTitle: new RegExp(this.queryString.adTitle, 'i')
      }).collation(queryOptions);
  
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
