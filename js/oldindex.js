var fs = require('fs');

var countries = ['AFGHANISTAN','AZERBAIJAN', 'JAPAN', 'QATAR', 'ARMENIA', 'JORDAN', 'SAUDI ARABIA', 'BAHRAIN', 'KAZAKHSTAN', 'SINGAPORE', 'BANGLADESH', 'KUWAIT', 'SOUTH KOREA', 'BHUTAN', 'KYRGYZSTAN', 'SRI LANKA', 'BRUNEI', 'LAOS', 'SYRIA', 'BURMA' ,
 'LEBANON', 'TAIWAN', 'CAMBODIA', 'MALAYSIA', 'TAJIKISTAN', 'CHINA', 'MALDIVES', 'THAILAND', 'TIMOR-LESTE', 'MONGOLIA', 'TURKEY', 'INDIA', 'NEPAL', 'TURKMENISTAN', 'INDONESIA', 'NORTH KOREA', 'UNITED ARAB EMIRATES', 'IRAN', 'OMAN', 'UZBEKISTAN',
 'MYANMAR','IRAQ', 'PAKISTAN', 'VIETNAM', 'ISRAEL', 'PHILIPPINES', 'YEMEN'];

var input = fs.createReadStream('data/Indicators.csv');
var outputFile_MF = 'output/maleFemale.json';
var outputFile_TOT = 'output/total.json';
var r1 = require('readline').createInterface({
  input : input,
  terminal : false
});
var newLine=[];
var index=0;
var headers=[];
var data_MF=[], data_TOT=[];
var output = '';

if(fs.existsSync(outputFile_MF)) {
  console.log(outputFile_MF + '  File already exists. Overwriting...');
  fs.unlinkSync(outputFile_MF);
}
if(fs.existsSync(outputFile_TOT)) {
  console.log(outputFile_TOT + '  File already exists. Overwriting...');
  fs.unlinkSync(outputFile_TOT);
}
fs.appendFileSync(outputFile_MF,'{ \n');
fs.appendFileSync(outputFile_TOT,'{ \n');
console.log('Starting...');
console.log('Processing. Please wait...');
var flagMF = false,flagTOT = false;
r1.on('line',function(line) {
  //console.log('This is a line -> ' + line);
    var lineObj={};
    var modLine = line.replace(/'[^']+'/g, function (match) {
        return match.replace(/,/g, '|');
    });

    newLine=modLine.split(',');

    if(index==0){
        headers=newLine;
        index++;
    }else if(countries.indexOf(newLine[0].toUpperCase()) > -1 && (newLine[3] === 'SP.DYN.LE00.FE.IN' || newLine[3] === 'SP.DYN.LE00.MA.IN' || newLine[3] === 'SP.DYN.LE00.IN')){
        for(i=0;i<headers.length;i++){
          lineObj[headers[i]]=newLine[i].replace(/'/g,'').replace('|',',');
        }
        delete lineObj.CountryCode;
        delete lineObj.IndicatorName;
        if(JSON.stringify(lineObj,null,2) !== '{}') {
            //console.log(lineObj.CountryName);
            switch (lineObj.IndicatorCode) {
              case 'SP.DYN.LE00.FE.IN':
                lineObj.IndicatorCode='F';
                if(flagMF) {
                  fs.appendFileSync(outputFile_MF,',\n');
                }
                fs.appendFileSync(outputFile_MF,JSON.stringify(lineObj,null,2) + '\n');
                flagMF = true;
                break;
              case 'SP.DYN.LE00.MA.IN':
                lineObj.IndicatorCode='M';
                if(flagMF) {
                  fs.appendFileSync(outputFile_MF,',\n');
                }
                fs.appendFileSync(outputFile_MF,JSON.stringify(lineObj,null,2) + '\n');
                flagMF = true;
                break;
              case 'SP.DYN.LE00.IN':
                  lineObj.IndicatorCode='T';
                  if(flagTOT) {
                    fs.appendFileSync(outputFile_TOT,',\n');
                  }
                  fs.appendFileSync(outputFile_TOT,JSON.stringify(lineObj,null,2) + '\n');
                  flagTOT = true;
                  break;
              default:
            }
        }
}

});

r1.on('close',function() {

  fs.appendFile(outputFile_MF,'\n }',function(err) {});
  fs.appendFile(outputFile_TOT,'\n }',function(err) {});
  console.log('\nFinished!\n');
});
