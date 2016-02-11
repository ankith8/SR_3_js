// Make 'stacked bar charts' of the following data, plot only the top 15 countries by GDP, for the year 2005, in descending order.
// GDP (constant 2005 US$) + GNI (constant 2005 US$)
// GDP per capita (constant 2005 US$) + GNI per capita (constant 2005 US$)
// Plot the GDP growth for India over the given time period.
// Plot the aggregated "GDP per capita (constant 2005 US$)" by continent, over the time period 1960-2015.

var readline = require('readline');
var fs = require('fs');

// variable Declarations
var headings = new Array();
var csv="WDI_Data.csv";

//Utilities
var countryList = new Array();
var countryContinentList = new Array();
var cLcsv="all_countries.csv";
var allCountriesJson="json/allCountries.json";
var allContinentsJson="json/allContinents.json";
var countryContinentJson="json/continents.json";
var countryContinentPairJson="json/countryContinent.json";

//1st problem
var gdpArr = new Array();
var gniArr = new Array();
var gdpPerCapArr = new Array();
var gniPerCapArr = new Array();

var gdpGniChartData="json/gdpGniChartData.json";
var gdpGniPerCapChartData="json/gdpGniPerCapChartData.json";

//2nd problem
var startIndex = 4;// The start index of the columm 1960 which is 4
var gdpForIndia = new Array();
var gdpIndiaData="json/gdpIndiaData.json";

//3rd problem
var gdpContinent = new Array();
var gdpAggregatedData="json/gdpAggregatedData.json";
var allContinents = new Array();

//***************************************************************************************
//****** Utility function to retrieve all the countries and the continents they belong to

var africa,asia,australia,n_america,s_america,europe;
var continentLists = {
  'AFRICA' : africa,
  'ASIA' : asia,
  'AUSTRALIA' : australia,
  'NORTH AMERICA' : n_america,
  'SOUTH AMERICA' : s_america,
  'EUROPE' : europe
};

var rlContinents = readline.createInterface({
  input: fs.createReadStream(cLcsv)
});

function createLookUpData()
{
  var head = new Array();
  var countryNameindex;
  var continentIndex;

  rlContinents.on('line',function(line){
    var arr = line.split(';');
    var lineLength = arr.length;
    if(head=="")
    {
      for(var i=0; i<lineLength; i++)
      {
        head.push(arr[i]);
        if(arr[i] === 'Country (en)')
        {
          countryNameindex = i;
        }
        else if(arr[i] === 'Continent')
        {
          continentIndex = i;
        }
      }
    }
    else
    {
      countryList.push(arr[countryNameindex]);
      var jsonObj = {};
      jsonObj[arr[countryNameindex]]=arr[continentIndex];
      // jsonObj["country"]=arr[countryNameindex];
      // jsonObj["continent"]=arr[continentIndex];
      countryContinentList.push(jsonObj);
    }
  });

  rlContinents.on('close',function(){
    fs.writeFile(allCountriesJson,JSON.stringify(countryList),'utf-8', function (err) {
      if (err) return console.log(err);
    });
    // fs.writeFile(countryContinentPairJson,JSON.stringify(countryContinentList),'utf-8', function (err) {
    //   if (err) return console.log(err);
    // });
  });
}
createLookUpData();

var countries = JSON.parse(fs.readFileSync(allCountriesJson));
var continents = JSON.parse(fs.readFileSync(countryContinentJson));

function GetAllContinents()
{
  for( var i=0,len=continents.length; i < len ; i++)
  {
    var continentName = continents[i].continent;
    continentName = GetProperContinent(continentName);
    if(allContinents.indexOf(continentName) == -1)
    {
        allContinents.push(continentName);
    }
  }
  fs.writeFile(allContinentsJson,JSON.stringify(allContinents),'utf-8', function (err) {
    if (err) return console.log(err);
  });
}
GetAllContinents();

function getContinentOfTheCountry(countri)
{
  for(var i = 0 ,len = continents.length; i < len ; i++)
  {
    if(countri === continents[i].country)
    {
      return continents[i].continent;
    }
  }
  return null;
}

  function GetProperContinent(conti)
  {
    switch (conti) {
      case 'North America':
      case 'Central America':
      case 'America':
      case 'Oceania':
        return 'North America';
      default:
        return conti;
    }
  }

//*******************************************************************************************************
//************ Utility function to retrieve all the countries and the continents they belong to *********
//*********************************************** end ****************************************************

var rl = readline.createInterface({
  input: fs.createReadStream(csv)
});

function ReadLines()
{
  var posCountryName,posIndicatorName,pos2005;

  rl.on('line', function (line)
  {
    var arr = line.split(",");
    var lineLength = arr.length;

//1st problem statement

    //header initialization
    if(headings == '') {
      for(var i=0; i<lineLength; i++) {
        headings.push(arr[i]);
        if(arr[i] === 'Country Name')
        {
          posCountryName = i;
        }
        else if(arr[i] === 'Indicator Name')
        {
          posIndicatorName = i;
        }
        else if(arr[i] === '2005')
        {
          pos2005 = i;
        }
      }
    }
    //
    else
     {
       //Problem 1
       // Check if the country we are looking up is a proper countryName
       if(countries.indexOf(arr[posCountryName]) != -1)
       {
         if(arr[posIndicatorName] === "GDP at market prices (constant 2005 US$)")
         {
           gdpArr[arr[posCountryName]] = parseFloat(arr[pos2005]);
         }
         else if(arr[posIndicatorName] === "GNI (constant 2005 US$)")
         {
           gniArr[arr[posCountryName]] = parseFloat(arr[pos2005]);
         }
         else if(arr[posIndicatorName] === "GDP per capita (constant 2005 US$)")
         {
           gdpPerCapArr[arr[posCountryName]] = parseFloat(arr[pos2005]);
         }
         else if(arr[posIndicatorName] === "GNI per capita (constant 2005 US$)")
         {
           gniPerCapArr[arr[posCountryName]] = parseFloat(arr[pos2005]);
         }
       }
        //Problem 1 end

        //Problem 2
        if(arr[posCountryName] === "India" && arr[posIndicatorName] === "GDP growth (annual %)")
        {
            for(var i = startIndex ; i < lineLength ; i++)
            {
              var jsonObj = {};
              jsonObj["year"]=headings[i];
              jsonObj["gdp"]=parseFloat(arr[i]);
              gdpForIndia.push(jsonObj);
            }
        }
        //Problem 2 end

        //Problem 3
        if(arr[posIndicatorName] === "GDP per capita (constant 2005 US$)")
        {
          // Plan // select the valid country name
          // identify the continent to which the country belongs to .
          var conti = continents[arr[posCountryName]]
          if(conti !== undefined)
          {
            // Add the GDP Percap value to the continent object's value.
            continentLists[conti] = aggregateGDP(continentLists[conti], arr);
            // push the continent to the json
            // console.log(conti+" : "+continentLists[conti]);
            // Remember this does not care anyhing about the country. this only deals with the continent
          }

        }
        //Problem 3 end
    }

  });
  rl.on('close',function(){

    // Problem 1
    gdpGniBarChart=sortArrayAndTrim(gdpArr, gniArr, "gdp", "gni");
    gdpGniPerCapitaBarChart=sortArrayAndTrim(gdpPerCapArr, gniPerCapArr, "gdppercapita", "gnipercapita");

    fs.writeFile(gdpGniChartData,JSON.stringify(gdpGniBarChart),'utf-8', function (err) {
      if (err) return console.log(err);
    });
    fs.writeFile(gdpGniPerCapChartData,JSON.stringify(gdpGniPerCapitaBarChart),'utf-8', function (err) {
      if (err) return console.log(err);
    });
    // Problem 1 end

    // Problem 2
    fs.writeFile(gdpIndiaData,JSON.stringify(gdpForIndia),'utf-8', function (err) {
      if (err) return console.log(err);
    });
    // Problem 2 end

    // Problem 3
    for(var i = startIndex,len=headings.length ; i < len ; i++)
    {
        var jsonOb = {};
        jsonOb["year"] = headings[i];
        for(j in continentLists) {
          jsonOb[j] = continentLists[j][i];
          // console.log( continentLists[j][i]+"****"+jsonOb[j]);
        }
        // console.log(json);
        gdpContinent.push(jsonOb);
    }
    fs.writeFile(gdpAggregatedData,JSON.stringify(gdpContinent),'utf-8', function (err) {
      if (err) return console.log(err);
    });
    // Problem 3
    console.log("complete");

  });
}

function aggregateGDP(continentObj, arr) {
  if(continentObj == null) {
    continentObj = arr;
  }
  else
  {
    for(var i=startIndex ,len=arr.length; i<len; i++) {
      if(arr[i].length > 0) {
        // console.log(continentObj[i]+"****"+arr[i]);
        continentObj[i] = parseFloat(continentObj[i]) + parseFloat(arr[i]);
      }
    }
  }
  return continentObj;
}

function sortArrayAndTrim(gdpArrObj, gniArrObj, gdpKey, gniKey) {

  var sortedGdp = new Array();
  // console.log("************************create key value pair for sorting *****************");
  for (key in gdpArrObj) {
      var temp = new Object();
      temp["key"] = key;
      temp["value"] = gdpArrObj[key];
      sortedGdp.push(temp);
  }

  // console.log("*********************before Sorting**********************");
  // Sort by value of gdp
  sortedGdp.sort(
    function(a, b) {
      return b.value - a.value;
    });
  // console.log("*********************after Sorting**********************");

  var finObj = [];
  // Top 15 countries to be made into JSON file
  for(var i=0; i<15; i++) {
    var jsonGdp = {};
    jsonGdp["country"] = sortedGdp[i].key;
    jsonGdp[gdpKey] = sortedGdp[i].value;
    jsonGdp[gniKey] = gniArrObj[sortedGdp[i].key];
    finObj.push(jsonGdp);
  }
  // Create the json obj containing
  // countryName , gdpOfTheCountry , gniOfTheCountry
  return finObj;
} //  end of sortArrayAndTrim

ReadLines();
