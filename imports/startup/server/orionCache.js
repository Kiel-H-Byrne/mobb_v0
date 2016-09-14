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
  // apply index for key                                                         
  this.localCache._ensureIndex( { "key": 1 });                                   
                                                                                 
  ttl = ttl || 60;                                                               
  // ensure key expiration                                                       
  this.localCache._ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: ttl });

  this.localCache.allow({
    update: function(userId, query) { return ownsDocument(userId, query); },
    remove: function(userId, query) { return ownsDocument(userId, query); },
  });
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
  var value = this.localCache.findOne({key: key}, {_id: false, value: true});    
  if (value) {                                                                   
    return value.value;                                                          
  }                                                                              
  return value;
};



export default OrionCache;