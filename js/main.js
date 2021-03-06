'use strict';
// Получить кнопку "Начать расчет" через id
let startCalc = document.getElementById('start');


//  Получить все блоки в правой части программы через классы
// (которые имеют класс название-value, начиная с <div class="budget-value"></div>
// и заканчивая <div class="yearsavings-value"></div>)
// let resultValues = document.body.getElementsByClassName('result-table')[0].querySelectorAll('[class*="value"]');
// console.log(resultValues);
let budgetValue           = document.body.getElementsByClassName('budget-value')[0],
    daybudgetValue        = document.body.getElementsByClassName('daybudget-value')[0],
    levelValue            = document.body.getElementsByClassName('level-value')[0],
    expensesValue         = document.body.getElementsByClassName('expenses-value')[0],
    optionalexpensesValue = document.body.getElementsByClassName('optionalexpenses-value')[0],
    incomeValue           = document.body.getElementsByClassName('income-value')[0],
    monthsavingsValue     = document.body.getElementsByClassName('monthsavings-value')[0],
    yearsavingsValue      = document.body.getElementsByClassName('yearsavings-value')[0];


// Получить поля(input) c обязательными расходами через класс. (class=”expenses-item”)
let expenses = document.body.getElementsByClassName('expenses-item');
// console.log(expenses);

// Получить кнопки “Утвердить” и “Рассчитать” через Tag, каждую в своей переменной.
let allBtns = document.body.getElementsByTagName('button');
let applyBtn0 = allBtns[0],
    applyBtn1 = allBtns[1],
    calcBtn0  = allBtns[2];
// let calcBtn1 = allBtns[3];

// console.log(allBtns);


//  Получить поля для ввода необязательных расходов (optionalexpenses-item) при помощи querySelectorAll
let optExpenses = document.querySelectorAll('.optionalexpenses-item');
// console.log(optExpenses);


// Получить оставшиеся поля через querySelector (статьи возможного дохода, чекбокс, сумма, процент, год, месяц, день)
let income      = document.body.querySelector('.choose-income'),
    haveSavings = document.body.querySelector('#savings'),
    sum         = document.body.querySelector('#sum'),
    percent     = document.body.querySelector('#percent'),
    yearValue   = document.body.querySelector('.year-value'),
    monthValue  = document.body.querySelector('.month-value'),
    dayValue    = document.body.querySelector('.day-value');

let appData = {
  budget: 0,
  timeData: '',
  expenses: {},
  income: [],
  savings: (haveSavings.checked || false),
  optionalExpenses: {},
};

// Стилизовать проект на свой вкус
document.addEventListener('DOMContentLoaded', (evt)=>{
  let tmp = document.body.getElementsByClassName('app')[0];
  tmp.style.background = '#f7f5fa';
  
  tmp = document.body.getElementsByClassName('result')[0];
  tmp.style.fontStyle = 'italic';
  
  tmp = tmp.querySelectorAll('[class*="value"]');
  tmp.forEach( el =>{
    el.style.color = '#bab040';
  });
});

startCalc.addEventListener('click', event=>{
  let tmp = null;
  
  while(1){
    tmp = prompt('введите дату', 'dd.mm.yyyy');
    if (tmp===null || tmp==='' || !/^\d{1,2}\.\d{1,2}\.\d{4}/.test(tmp)){
      continue;
    }
    tmp = tmp.split('.');
    appData.dateTime = new Date(tmp[2], tmp[1]-1, tmp[0]);
    yearValue.value = tmp[2];
    monthValue.value = tmp[1];
    dayValue.value = tmp[0];
    break;
  }
  
  while (1) {
    tmp = parseFloat(prompt('Ваш бюджет на месяц?', ''));
    if (isNaN(tmp) && tmp > 0) {
      alert('Please, enter a valid number, grater than 0.');
    } else {
      // money = tmp;
      appData.budget = tmp;
      budgetValue.textContent = appData.budget.toFixed(2);
      break;
    }
  }
  
  // сюда можно влепить проверку заполненности полей и активировать кнопки
  // чтоб пользователю не пришлось генерировать события в полях
});


// сохранить описания расходов
applyBtn0.addEventListener('click', event =>{
  let sum = 0;
  
  for (let i=0; i<expenses.length; i+=2){
    if ( expenses[i].value !== '' && isNumeric(expenses[i+1].value) ){
      appData.expenses[expenses[i].value] = parseFloat(expenses[i+1].value);
      sum += appData.expenses[expenses[i].value];
    }
  }
  
  expensesValue.textContent = sum;
  
  // активируем кнопку расчёта расходов после утверждения
  calcBtn0.removeAttribute('disabled');
  calcBtn0.style.backgroundImage = '';
});

// сохранить описание дополнительных расходов
applyBtn1.addEventListener('click', event =>{
  optionalexpensesValue.textContent = '';
  
  for (let i=0; i<optExpenses.length; i++){
    appData.optionalExpenses[i] = optExpenses[i].value;
  
    if (optExpenses[i].value !== ''){
      optionalexpensesValue.textContent += optExpenses[i].value + ' ';
    }
  }
  
});


// рассчитать дневные затраты
calcBtn0.addEventListener('click', evt => {
  
  let allExpenses = 0;
  
  if (appData.budget){ // если у нас есть бюджет рассчитываем
  
    // Реализовать функционал: при расчете дневного бюджета учитывать сумму обязательных трат
    // (т. e. от бюджета на месяц отнимаем общую сумму всех обяз. трат и ее делим на 30 дней)
    for (let i in appData.expenses) {
      allExpenses += appData.expenses[i];
    }
    appData.moneyPerDay = (appData.budget - allExpenses)/ 30;
    //////
    
    daybudgetValue.textContent = appData.moneyPerDay.toFixed(2);
  
    if (appData.moneyPerDay < 100) {
      levelValue.textContent = 'минимальный уровень достатка';
    } else if (appData.moneyPerDay >= 100 && appData.moneyPerDay < 2000) {
      levelValue.textContent = 'средний уровень достатка';
    } else if (appData.moneyPerDay >= 2000) {
      levelValue.textContent = 'высокий уровень достатка';
    } else {
      levelValue.textContent = 'невозможно вычислить, произошла ошибка';
    }
  } else {
    levelValue.textContent = 'невозможно вычислить уровень достатка при неизвестных доходах';
  }
});

// дополнительный доход
income.addEventListener('input', evt =>{
  let items = income.value.split(',');
  items.forEach((el, i, ar)=>{ ar[i] = el.trim(); });
  appData.income = items;
  incomeValue.textContent = appData.income.join('; ');
});


//----------- учёт и расчёт накоплений
haveSavings.addEventListener('change', evt=>{
  appData.savings = evt.target.checked;
});

function calcSaving(evt) {
  if (appData.savings && sum.value !== '' && percent.value !== ''){
    monthsavingsValue.textContent = (parseFloat(sum.value)/100/12*parseFloat(percent.value)).toFixed(2);
    yearsavingsValue.textContent = (parseFloat(sum.value)/100*parseFloat(percent.value)).toFixed(2);
  }
}

sum.addEventListener('input', calcSaving);
percent.addEventListener('input', calcSaving);
//-------------------------------------



// Если программа еще не запущена( не нажали кнопку "Начать расчет")
// или нужное(соответственное) для заполнения поле пустое - сделать кнопки неактивными.
// (Например, если ни одно поле обязательных расходов не заполнено - блокируем кнопку "Утвердить")
for (let i = 0; i < allBtns.length - 1; i++) {
  allBtns[i].disabled = true;
  allBtns[i].style.backgroundImage = 'none';
}

// назначаем отслеживание изменений на все инпуты обязательных расходов
for (let i=0; i<expenses.length; i++){
  if(i%2===0){ // для чётных (навания расходов)
    expenses[i].addEventListener('input', evt=> {
      let isExpensesFull = true;
      
      // блокируем кнопку рассчитать пока не утвердим новые расходы
      calcBtn0.disabled = 'disabled';
      calcBtn0.style.backgroundImage = 'none';
  
      // проверяем чтоб все поля были заполнены
      for (let j =0; j<expenses.length; j++){
        if (expenses[j].value === ''){
          isExpensesFull = false;
          break;
        }
      }
  
      // если все поля заполнены и запустили "начать расчёт" то разблокируем кнопку утвердить расходы
      if(isExpensesFull && appData.budget > 0){
        applyBtn0.removeAttribute('disabled');
        applyBtn0.style.backgroundImage = '';
      } else {
        applyBtn0.disabled = 'disabled';
        applyBtn0.style.backgroundImage = 'none';
      }
    });
  } else { // для нечётных (суммы расходов)
    expenses[i].addEventListener('input', evt=> {
      if ( !expenses[i].oldValue ) {expenses[i].oldValue = '';} // в js всё объекты, так что лепим свои свойства
      let isExpensesFull = true;
  
      // блокируем кнопку рассчитать пока не утвердим новые расходы
      calcBtn0.disabled = 'disabled';
      calcBtn0.style.backgroundImage = 'none';
      
      // если некорректный ввод для поля, то восстанавливаем предыдущее значение
      if ( /^\d+$/.test(expenses[i].value) || expenses[i].value === '') {
        expenses[i].oldValue = expenses[i].value;
      } else {
        expenses[i].value = expenses[i].oldValue;
      }
      
      // проверяем чтоб все поля были заполнены
      for (let j =0; j<expenses.length; j++){
        if (expenses[j].value === ''){
          isExpensesFull = false
        }
      }
      
      // если все поля заполнены и запустили "начать расчёт" то разблокируем кнопку утвердить расходы
      if(isExpensesFull && appData.budget > 0){
        applyBtn0.removeAttribute('disabled');
        applyBtn0.style.backgroundImage = '';
      } else {
        applyBtn0.disabled = 'disabled';
        applyBtn0.style.backgroundImage = 'none';
      }
    });
  }
}

// назначаем обработчик на изменение каждого поля необязательных расходов
for (let i=0; i<optExpenses.length; i++){
  optExpenses[i].addEventListener('input', evt =>{
    if ( !optExpenses[i].oldValue ) {optExpenses[i].oldValue = '';} // в js всё объекты, так что лепим свои свойства
    
    // в поле "необязательные расходы" можно использовать только русские буквы
    // если некорректный ввод для поля, то восстанавливаем предыдущее значение
    if ( /^[А-Яа-яЁё_\-\ ]+$/.test(optExpenses[i].value) || optExpenses[i].value === '' ) {
      optExpenses[i].oldValue = optExpenses[i].value;
    } else {
      optExpenses[i].value = optExpenses[i].oldValue;
    }
    
    // активируем кнопку утверждения расходов только если запустили "начать расчёт"
    if (appData.budget > 0) {
      applyBtn1.removeAttribute('disabled');
      applyBtn1.style.backgroundImage = '';
    }
  });
}


//////////////////////////////////////////////////
function isEmptyParam(param) {
  if (param === undefined || param === null) {
    return true;
  }
  if (typeof param === "string" && param.length === 0) {
    return true;
  }
  if (typeof param === "object" && Object.keys(param).length === 0) {
    return true;
  }
  
  return false;
}

function isNotEmptyParam(param) {
  return !isEmptyParam(param);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNotNumeric(n) {
  return  !( !isNaN(parseFloat(n)) && isFinite(n) );
}