OrionCache = function(cacheName, ttl) {                                          
  this.localCache = new orion.collection("cache_" + cacheName, {
    singularName : 'cache',
    pluaralName : 'caches',
    link : {title: 'Caches'}, 
    tabular : {
      columns : [
        { 
          data: "key", 
          title: "API Call" 
        },{ 
          data: "value", 
          title: "API Response" 
        },
          // orion.attributeColumn('createdAt', 'createdAt', 'Retrieved @')
          {
            data: "createdAt",
            title: "Retrieved @"
          }
      ]
    }
  });                       
    
    ttl = ttl || 60;                                                  
    
    if (Meteor.isServer) {
      // console.log(this);
      // Meteor.publish('cache_' + cacheName, function() {
      //   // console.log(this);
      //   let cursor = this.localCache.find();
      //   console.log(cursor);
      //   return cursor;
      // });  

    // apply index for key                                                         
    this.localCache._ensureIndex( { "key": 1 });                                   
                                                                  
    // ensure key expiration                                                       
    this.localCache._ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: ttl });

    this.localCache.allow({
      insert: function(userId, query) { return true },
      update: function(userId, query) { return ownsDocument(userId, query); },
      remove: function(userId, query) { return ownsDocument(userId, query); }
    });
  }
};                                                                               
                                                                                 
/**                                                                              
 * Set key and value to the cache                                                
 * @param key                                                                    
 * @param value                                                                  
 */                                                                              
OrionCache.prototype.set = function (key, value) {                               
  this.localCache.insert(                                                        
    {                                                                            
      key: key,                                                                  
      value: value,                                                              
      // createdAt: orion.attribute('createdAt'),
      createdAt: new Date()
    }                                                                            
  );                                                                             
};

/**                                                                              
 * Get value from the cache                                                      
 * @param key to search for                                                      
 * @returns found value                                                          
 *  or undefined if not found                                                    
 */                                                                              
OrionCache.prototype.get = function (key) {                                      
  let value = this.localCache.findOne({key: key}, {_id: false, value: true});    
  if (value) {                                                                   
    return value.value;                                                          
  }                                                                              
  return value;
};


export default OrionCache;