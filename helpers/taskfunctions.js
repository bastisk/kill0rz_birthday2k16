var request = require('request');

module.exports.solve = function solve(id, solution, callback){

  if(id == 1){
      var n = Math.floor((Math.random() * 99) + 2);
      var k = [];

      for(var i = 0; i < n; i++){
        var rki = Math.floor((Math.random() * 1000) + 1);
        k.push(rki);
      }
      result = solvelorenz(k);
      console.log({data:JSON.stringify(k)});

      request.post(solution, {form:{data:JSON.stringify(k)}}, function(err, response, body){
          if(err) console.log(err);
          try{
            console.log(body);
            var apiresult = JSON.parse(body);
            if(JSON.stringify(result) == JSON.stringify(apiresult))
              callback(true);
            else callback(false);
          } catch(err){
            console.log(err);
          }

      });

    }

}

function solvelorenz(input){
  var sums = [];
  var tempsum = 0;
  //Get Sum + Anteil
  for(var i = 1; i <= input.length; i++){
    tempsum = tempsum + parseInt(input[i - 1]);
    var anteil = i / input.length;
    sums.push({value: input[i - 1], sum: tempsum, anteil: anteil.toFixed(2) });
  }

  //Get final Values
  var result = [];
  for(var i = 0; i < sums.length; i++){
    var haufigkeit = sums[i].sum / tempsum;
    result.push({x: haufigkeit.toFixed(2), y: sums[i].anteil});
  }

  return result;
}

module.exports.solvelorenz = function solvelorenz(input){
  var sums = [];
  var tempsum = 0;
  //Get Sum + Anteil
  for(var i = 1; i <= input.length; i++){
    tempsum = tempsum + parseInt(input[i - 1]);
    var anteil = i / input.length;
    sums.push({value: input[i - 1], sum: tempsum, anteil: anteil.toFixed(2) });
  }

  //Get final Values
  var result = [];
  for(var i = 0; i < sums.length; i++){
    var haufigkeit = sums[i].sum / tempsum;
    result.push({x: haufigkeit.toFixed(2), y: sums[i].anteil});
  }

  return result;
}
