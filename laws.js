function hello(PersonName, FromDate, ToDate){
    console.log("hello");
    document.querySelector('[aria-label=" Person Number"]').value = PersonName;
    document.querySelectorAll('[aria-label="dd-mmm-yyyy"]')[0].value = FromDate;
    document.querySelectorAll('[aria-label="dd-mmm-yyyy"]')[1].value = ToDate;
};

function clickWithDelay(selector) {
    return new Promise(resolve => {
        setTimeout(() => {
            document.querySelector(selector).click();
            resolve();
        }, 1500);
    });
}

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
    currentTimeCardState["NumberOfAT"] = numberOfAT;
    if(numberOfAT == 0){
        return;
    }else{
        for(let i=0;i<numberOfAT;i++){
            
        }
    }
}
