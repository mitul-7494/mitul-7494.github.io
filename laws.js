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


var cardState = {
    "AbsentType" : {},
    "NumberOfAT" : 0,
    "startingDay" : 0,
    "endingDay" : 6,
    "rowNo" : 0
}

function SetCardState(){
    let numberOfAT = document.getElementsByClassName('xwn').length - 5;
    let [startingDate, endingDate] = document.querySelector("[id$=':tcDetails'] > table > tbody > tr > td.x1b0").innerText.split(" : ")[1].split(" - ");
    let startingDay = getDayOfWeek(startingDate);
    let endingDay = getDayOfWeek(endingDate);
    cardState["NumberOfAT"] = numberOfAT;
    cardState["rowNo"] = 0;
    cardState["startingDay"] = startingDay;
    cardState["endingDay"] = endingDay;
    if(numberOfAT == 0){
        cardState["AbsentType"] = {};
        return;
    }else{
        let dict = {};
        for(let i=0;i<numberOfAT;i++){
            let dayArr = [false, false, false, false, false, false, false];
            for(let j=startingDay+1;j<=endingDay+1;j++){
                let hourString = document.getElementsByClassName('x1u p_AFReadOnly')[(i*(endingDay-startingDay+1))+(j-1)].innerText;
                if(hourString != ""){
                    dayArr[j-1] = true;
                }
            }
            let key = expenditureMap[document.querySelectorAll('.x2hi span[id$="socMatrixAttributeNumber6"]')[i].innerText];
            dict[key] = dayArr;
        }
        cardState["AbsentType"] = dict;
    }
}

function IsEmptyHourList(arr){
    return arr.join('').length == 0;
}

function delay(milsec){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milsec);
    })
}


async function ManipulateData(excelDataString){
    let excelData = excelDataString.split("~");
    let Project = excelData[0];
    let Task = excelData[1];
    let expanditureTask = expenditureMap[excelData[2]];
    let excelHour = excelData.slice(3,10);
    if(cardState["NumberOfAT"] > 0 && expanditureTask != "4"){
        let absTypeDict = cardState["AbsentType"];
        for(let absType in absTypeDict){
            let initHour = ['', '', '', '', '', '', ''];
            let conflictingHour = absTypeDict[absType];
            for(let i = cardState["startingDay"]; i<= cardState["endingDay"]; i++){
                if(conflictingHour[i]){
                    initHour[i] = excelHour[i];
                    excelHour[i] = '';
                }
            }
            if(!IsEmptyHourList(initHour)){
                await FillRow(Project,Task, initHour, absType);
            }
        }
    }
    if(!IsEmptyHourList(excelHour)){
        await FillRow(Project, Task, excelHour, expanditureTask);
    }
}


function SetProject(index, project) {
    return new Promise((resolve, reject) => {
        waitForElement(`[id*='\\:socMatrixAttributeNumber2\\:\\:lovIconId']`).then(() => {
            document.querySelectorAll(`[id*='\\:socMatrixAttributeNumber2\\:\\:lovIconId']`)[index].click();
            return waitForElement("[id*='socMatrixAttributeNumber2\\:\\:dropdownPopup\\:\\:popupsearch']");
        }).then(() => {
            document.querySelector("[id*='socMatrixAttributeNumber2\\:\\:dropdownPopup\\:\\:popupsearch']").click();
            return waitForElement("[id*=':socMatrixAttributeNumber2lovPopupId\\:\\:popup-container']");
        }).then(() => {
            return waitForElement("[id*='_afrLovInternalQueryId\\:\\:mode']");
        }).then(() => {
            document.querySelector("[id*='_afrLovInternalQueryId\\:\\:mode']").click();
            return waitForElement('[id*="_afrLovInternalQueryId\\:operator0\\:\\:pop"] > li:nth-child(6)');
        }).then(() => {
            document.querySelector('[id*="_afrLovInternalQueryId\\:operator0\\:\\:pop"] > li:nth-child(6)').click();
            document.querySelector('input[aria-label=" Display Value"]').value = project;
            document.querySelector("[id*='_afrLovInternalQueryId\\:\\:search']").click(); // Click search
            return waitForElement('[id*="socMatrixAttributeNumber2_afrLovInternalTableId::db"] > table > tbody > tr');
        }).then(() => {
            document.querySelectorAll('[id*="socMatrixAttributeNumber2_afrLovInternalTableId::db"] > table > tbody > tr')[0].click();
            document.querySelector("[id*='\\:lovDialogId\\:\\:ok']").click();
            resolve(); // Resolve the Promise when all operations are completed
        }).catch((error) => {
            reject(error); // Reject the Promise if there's an error
        });
    });
}


function selectTask(index, task) {
    return new Promise((resolve, reject) =>{
        waitForElement(`[id*='\\:socMatrixAttributeNumber4\\:\\:lovIconId']`).then(() => {
            document.querySelectorAll(`[id*='\\:socMatrixAttributeNumber4\\:\\:lovIconId']`)[index].click();
            return waitForElement("[id*='socMatrixAttributeNumber4\\:\\:dropdownPopup\\:\\:popupsearch']");
        }).then(() => {
            document.querySelector("[id*='socMatrixAttributeNumber4\\:\\:dropdownPopup\\:\\:popupsearch']").click(); // Click popup search
            return waitForElement("[id*=':socMatrixAttributeNumber4lovPopupId\\:\\:popup-container']");
        }).then(() => {
            return waitForElement("[id*='_afrLovInternalQueryId\\:\\:mode']");
        }).then(() => {
            document.querySelector("[id*='_afrLovInternalQueryId\\:\\:mode']").click();
            return waitForElement('[id*="_afrLovInternalQueryId\\:operator0\\:\\:pop"] > li:nth-child(6)');
        }).then(() => {
            document.querySelector('[id*="_afrLovInternalQueryId\\:operator0\\:\\:pop"] > li:nth-child(6)').click();
            document.querySelector('input[aria-label=" Display Value"]').value = task;
            document.querySelector("[id*='_afrLovInternalQueryId\\:\\:search']").click(); // Click search
            return waitForElement("[id*='_afrLovInternalTableId\\:\\:db'] > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td");
        }).then(() => {
            document.querySelector("[id*='_afrLovInternalTableId\\:\\:db'] > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td").click();
            document.querySelector("[id*='\\:lovDialogId\\:\\:ok']").click();
            resolve(); // Resolve the Promise when all operations are completed
        }).catch((error) => {
            console.error("Error:", error);
            reject(error); // Reject the Promise if there's an error
        });
    });
}

async function setHoursData(index, data) {
    console.log("herwdf");
    let counter = 1;
    for(let i = 0; i <= 6; i++, counter++) {
        document.querySelectorAll(`input[id*="\\:m${counter}\\:\\:content"]`)[index].value = data[i];
        console.log("count", counter ,"data",  data[i], "index", index);
    }
    console.log("comp");
}

function SetExpend(index, type) {
    return new Promise((resolve, reject) =>{
        waitForElement('[title="Search: Expenditure Type"]').then(() => {
            document.querySelectorAll('[title="Search: Expenditure Type"]')[index].click();
            return waitForElement("[id*='socMatrixAttributeChar1\\:\\:dropdownPopup\\:\\:popupsearch']");
        }).then(() => {
            document.querySelector("[id*='socMatrixAttributeChar1\\:\\:dropdownPopup\\:\\:popupsearch']").click();
            return waitForElement("[id*=':socMatrixAttributeChar1lovPopupId\\:\\:popup-container']");
        }).then(() => {
            return waitForElement("[id*='_afrLovInternalQueryId\\:\\:search']");
        }).then(() => {
            document.querySelector("[id*='_afrLovInternalQueryId\\:\\:search']").click();
            return waitForElement('[id*="\\:socMatrixAttributeChar1_afrtablegridcell\\:\\:c"] > div > div:nth-child(2) > table > tbody');
        }).then(() => {
            document.querySelector('[id*="\:socMatrixAttributeChar1_afrtablegridcell\:\:c"] > div > div:nth-child(2) > table > tbody').querySelector(`tr[_afrrk='${type}']`).click();
            return waitForElement("[id*='socMatrixAttributeChar1\\:\\:lovDialogId\\:\\:ok']");
        }).then(() => {
            document.querySelector('[id*="socMatrixAttributeChar1\\:\\:lovDialogId\\:\\:ok"]').click();
            resolve();
        }).catch((error) => {
            console.error("Error:", error);
            reject(error);
        });
    });
}


async function FillRow(project, task, hourList, exType){
    return new Promise((resolve, reject) => {
        let index = cardState["rowNo"];
        console.log("here0");
        SetProject(index, project)
        .then(() => {
            console.log("here1");
            return selectTask(index, task);
        })
        .then(() => {
            console.log("here2");
            return SetExpend(index, exType);
        })
        .then(() => {
            return delay(1500);
        })
        .then(async () => {
            console.log("here3");
            await setHoursData(index, hourList);
            console.log("dasfasdfa");
            cardState["rowNo"] = index+1;
            resolve();
        }).catch((error) => {
            reject();
            throw error;
        });
    });
}
