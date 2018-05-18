'use strict';

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

exports.handler = async (event, context, callback) => {
    console.log('LogScheduledEvent');
    // console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region
    AWS.config.update({region: 'eu-west-1'});
    
    // Create DynamoDB service object
    var ddb = new AWS.DynamoDB();
    
    var tables = [
      {
        TableName: 'LIVE-apiLogs',
        IndexName: 'dummy-timestamp-index'
      }
    ];
    
    var paramsDefault = {
       ConsistentRead: false,
       Limit: 2
    };
    
    var sscan = function(params) {
      ddb.scan(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          return "Error";
        } else {
          console.log("Success");
          return "Success";
        }
      });
    }
    
    function wait(){
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("hello"), 2000)
        });
    }
    
    for(let i=0; i < tables.length; i++) {
      
      let params = paramsDefault;
      params.TableName = tables[i].TableName;
      
      console.log(params);
      sscan(params);
      
      await wait();
      
      params = extend(paramsDefault, tables[i]);
      console.log(params);
      sscan(params);
      
      console.log('------------------');
      
      await wait();
    
    }
    
    callback(null, 'Finished');
};
