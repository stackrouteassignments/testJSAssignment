const fs = require('fs');
//const path = require('path');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'myapp'});

const countries = ["AFGHANISTAN","AZERBAIJAN", "JAPAN", "QATAR", "ARMENIA",
"JORDAN", "SAUDI ARABIA", "BAHRAIN", "KAZAKHSTAN", "SINGAPORE", "BANGLADESH",
"KUWAIT", "SOUTH KOREA", "BHUTAN", "KYRGYZSTAN", "SRI LANKA", "BRUNEI", "LAOS",
"SYRIA", "BURMA", "LEBANON", "TAIWAN", "CAMBODIA", "MALAYSIA", "TAJIKISTAN",
"CHINA", "MALDIVES", "THAILAND", "TIMOR-LESTE", "MONGOLIA", "TURKEY", "INDIA",
"NEPAL", "TURKMENISTAN", "INDONESIA", "NORTH KOREA", "UNITED ARAB EMIRATES", "IRAN",
"OMAN", "UZBEKISTAN", "MYANMAR","IRAQ", "PAKISTAN", "VIETNAM", "ISRAEL", "PHILIPPINES", "YEMEN"];

const input = fs.createReadStream('datafiles/Indicators.csv');
const outputFile_MF = "output/maleFemale.json";
const outputFile_TOT = "output/total.json";
const r1 = require('readline').createInterface({
  input : input,
  terminal : false
});
let newLine=[];
let index=0;
let headers=[];

if(fs.existsSync(outputFile_MF)) {
  log.info(outputFile_MF + '  File already exists. Overwriting...');
  fs.unlinkSync(outputFile_MF);
}
if(fs.existsSync(outputFile_TOT)) {
  log.info(outputFile_TOT + '  File already exists. Overwriting...');
  fs.unlinkSync(outputFile_TOT);
}
fs.appendFileSync(outputFile_MF,"{ \n");
fs.appendFileSync(outputFile_TOT,"{ \n");
log.info('Starting...');
log.info('Processing. Please wait...');
let flagMF = false, flagTOT = false;
function processLine(lineObj){
  switch (lineObj.IndicatorCode) {
    case "SP.DYN.LE00.FE.IN":
      lineObj.IndicatorCode="F";
      if(flagMF) {
        fs.appendFileSync(outputFile_MF,",\n");
      }
      fs.appendFileSync(outputFile_MF,JSON.stringify(lineObj,null,2) + "\n");
      flagMF = true;
      break;
      case "SP.DYN.LE00.MA.IN":
      lineObj.IndicatorCode="M";
      if(flagMF) {
        fs.appendFileSync(outputFile_MF,",\n");
      }
      fs.appendFileSync(outputFile_MF,JSON.stringify(lineObj,null,2) + "\n");
      flagMF = true;
      break;
    case "SP.DYN.LE00.IN":
        lineObj.IndicatorCode="T";
        if(flagTOT) {
          fs.appendFileSync(outputFile_TOT,",\n");
        }
        fs.appendFileSync(outputFile_TOT,JSON.stringify(lineObj,null,2) + "\n");
        flagTOT = true;
        break;
    default:
  }
}
r1.on('line',function(line) {
  //log.info('This is a line -> ' + line);
    const lineObj={};
    const modLine = line.replace(/"[^"]+"/g, function (match) {
        return match.replace(/,/g, '|');
    });

    newLine=modLine.split(",");

    if(index===0){
        headers=newLine;
        index=index+1;
    }else if(countries.indexOf(newLine[0].toUpperCase()) > -1 &&
    (newLine[3] === "SP.DYN.LE00.FE.IN" || newLine[3] === "SP.DYN.LE00.MA.IN" ||
     newLine[3] === "SP.DYN.LE00.IN")){
        for(let i=0;i<headers.length;i=i+1){
          lineObj[headers[i]]=newLine[i].replace(/"/g,"").replace("|",",");
        }
        delete lineObj.CountryCode;
        delete lineObj.IndicatorName;
        if(JSON.stringify(lineObj,null,2) !== "{}") {
            //log.info(lineObj.CountryName);
            processLine(lineObj);
          }
}

});

r1.on('close',function() {

  fs.appendFile(outputFile_MF,"\n }",function(err) {
    log.info(err);
  });
  fs.appendFile(outputFile_TOT,"\n }",function(err) {
    log.info(err);
  });
  log.info("\nFinished!\n");
});
