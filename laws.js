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

var x = {'state':['new']};

function StateOld(){
    x['state'] = ['old'];
}

function StateNew(){
    x['state'] = ['new'];
}

function PrintState(){
    console.log(JSON.stringify(x));
}
