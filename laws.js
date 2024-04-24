function hello(PersonName, FromDate, ToDate){
    console.log("hello");
    document.querySelector('[aria-label=" Person Number"]').value = PersonName;
    document.querySelectorAll('[aria-label="dd-mmm-yyyy"]')[0].value = FromDate;
    document.querySelectorAll('[aria-label="dd-mmm-yyyy"]')[1].value = ToDate;
};


function action(){
    clickWithDelay('[alt="Create"]')
    .then(() => clickWithDelay('[id*=":personName2Id::lovIconId"]'))
    .then(() => clickWithDelay('[id*=":personName2Id::dropdownPopup::popupsearch"]'))
    .then(() => clickWithDelay('[id*=":personName2Id::_afrLovInternalQueryId::mode"]'));
}

//get difference in days
function getDifferenceInDays(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const differenceInMs = Math.abs(date1 - date2);
    var differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)) + 1
    const remdayweek = differenceInDays % 7 == 0 ? 0 : 1;
    differenceInDays = Math.floor(differenceInDays / 7)
    return differenceInDays + remdayweek;
}

//
function getDayOfWeek(dateString) {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const monthAbbrev = parts[1];
    const year = parseInt(parts[2], 10);

    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthAbbreviations.findIndex(abbr => abbr === monthAbbrev);
    const date = new Date(year, month, day);
    return date.getDay();
}

//mapping of expenditure to tr attribute
var expenditureMap = {
  "Annual Leave": "0",
  "Bank Holidays": "1",
  "Contracted Hours - Employee": "2",
  "Employee Volunteering and Fundraising": "3",
  "Extra Hours - Employee": "4",
  "Leavers/Joiners": "5",
  "Mace Day": "6",
  "Other Leave - Christmas Close Down": "7",
  "Other Leave - Compassionate": "8",
  "Other Leave - Jury Service": "9",
  "Other Leave - Medical Appointments": "10",
  "Other Leave - Paid": "11",
  "Other Leave - Study Leave": "12",
  "Other Leave - Unpaid": "13",
  "Other Leave - Voluntary Reserve Forces Leave": "14",
  "Parental Leave": "15",
  "Sickness (Long Term) (GIP)": "16",
  "Sickness (Short Term)": "17",
  "Training": "18"
}


var currentTimeCardState = {
    "AbsentType" : {},
    "NumberOfAT" : 0,
    "startingDay" : 0,
    "endingDay" : 6,
}

function SetCardState(){
    let numberOfAT = document.getElementsByClassName('xwn').length - 5;
    let [startingDate, endingDate] = document.querySelector("[id$=':tcDetails'] > table > tbody > tr > td.x1b0").innerText.split(" : ")[1].split(" - ");
    let startingDay = getDayOfWeek(startingDate);
    let endingDay = getDayOfWeek(endingDate);
    currentTimeCardState["NumberOfAT"] = numberOfAT;
    currentTimeCardState["startingDay"] = startingDay;
    currentTimeCardState["endingDay"] = endingDay;
    if(numberOfAT == 0){
        currentTimeCardState["AbsentType"] = {};
        return;
    }else{
        let dict = {};
        for(let i=0;i<numberOfAT;i++){
            let dayArr = [false, false, false, false, false, false, false];
            for(let j=startingDay+1;j<=endingDay+1;j++){
                let hourString = document.querySelector(`[id*='${i}\\:m${j-startingDay}::content']`).innerText;
                if(hourString != ""){
                    dayArr[j-1] = true;
                }
            }
            let key = expenditureMap[document.querySelector(`[id*='0\\:socMatrixAttributeNumber6\\:\\:content']`).innerText];
            dict[key] = dayArr;
        }
        currentTimeCardState["AbsentType"] = dict;
    }
}

function IsEmptyHourList(arr){
    return arr.join('').length == 0;
}

function ManipulateData(excelDataString){
    let excelData = excelDataString.split("~");
    let Project = excelData[0];
    let Task = excelData[1];
    let expanditureTask = expenditureMap[excelData[2]];
    let excelHour = excelData.slice(3,10);
    if(currentTimeCardState["NumberOfAT"] > 0 && expanditureTask != "4"){
        let absTypeDict = currentTimeCardState["AbsentType"];
        for(let absType in absTypeDict){
            let initHour = ['', '', '', '', '', '', ''];
            let conflictingHour = absTypeDict[absType];
            for(let i = currentTimeCardState["startingDay"]; i<=currentTimeCardState["endingDay"]; i++){
                if(conflictingHour[i]){
                    initHour[i] = excelHour[i];
                    excelHour[i] = '';
                }
            }
            if(!IsEmptyHourList(initHour)){
                console.log(Project, Task, absType, initHour);
            }
        }
    }
    if(!IsEmptyHourList(excelHour)){
        console.log(Project, Task, expanditureTask, excelHour);
    }
}
