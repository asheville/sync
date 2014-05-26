module.exports = function(mongoose) {
  var logger = require('../logger');
  
  var itemSchema = mongoose.Schema({
    user_id: String,
    storage_id: String,
    source_id: String,
    source_item_id: String,
    content_type_id: String,
    sync_attempted_at: Date,
    sync_verified_at: Date,
    sync_failed_at: Date,
    bytes: Number,
    path: String,
    description: String,
    error: String
  });

  itemSchema.statics.findOrCreate = function(attributes, callback) {
    _this = this;
    logger.trace('finding or creating item', { attributes: attributes });

    this.findOne(attributes, function(error, item) {
      if (item) {
        logger.trace('found item', { id: item.id });
        callback(error, item);
      } else {
        _this.create(attributes, function(error, item) {
          if (error) {
            logger.warn('failed to create new item', { error: error.message });
          } else {
            logger.trace('created new item', { id: item.id });
          }
          
          callback(error, item);
        });
      }
    });
  };

  return mongoose.model('Item', itemSchema);
}