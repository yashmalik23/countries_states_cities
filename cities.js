const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const country_list = require('./countries.json')

country_list.map(({country,states}, index) => {
  states.map((state,_)=>{
    let cities = [];
    let path = ''
    if(state.indexOf('general') > -1){
      path = `./${country.replace("&", "_")}/city.csv`
    }else{
      path = `./${country.replace("&", "_")}/city/${state.replace(' & ',' _ ').replace('&','_').trim()}.csv`
    }
    fs.createReadStream(path)
    .pipe(csv())
    .on("data", (data) => {
      let key = Object.keys(data)[0]
      key && cities.indexOf(key) < 0 && cities.push(key)
      key && data[key] && cities.push(data[key].replace("_", "&").trim());
    })
    .on("end", () => {
      cities.map((city,_)=>{
        results.push({
          city,
          state
        })
      })
      index == 229 && fs.writeFile('cities.json', JSON.stringify(results) ,'utf8', (err)=>{console.log(err)})
    });
  })
});
