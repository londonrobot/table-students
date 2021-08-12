(() => {
  document.addEventListener('DOMContentLoaded', () => {

    class student {
      constructor(name, surname, thirdName, birth, startYear, faculty) {
        this.name = name;
        this.surname = surname;
        this.thirdName = thirdName;
        this.birth = birth;
        this.startYear = startYear;
        this.faculty = faculty;
      }
    }

    const students = [];
    defaultData(); // заполнение какими-нибудь данными

    const body = document.body;
    const mainContainer = makeElement ('div', 'container', body, '', 'container');
    const h1 = makeElement ('h1', 'h1', mainContainer, 'Список студентов', 'h1');

    const formContainer = makeElement ('div', '', mainContainer, '', 'form-container');
    const additionForm = makeElement ('form', 'addition-form', formContainer, '', 'addition-form');
    const warnings = makeElement('div', 'warnings', formContainer, '', 'warnings'); // ошибки формы ввода

    const formfieldName = makeElement('div', '', additionForm, '', 'form-field');
    const formName = makeElement ('input', 'name-input', formfieldName, '', 'name-input');
    formName.setAttribute('type', 'text');
    makeElement ('span', '', formfieldName, 'Имя ', 'formDescription');

    const formfieldSurname = makeElement('div', '', additionForm, '', 'form-field');
    const formSurname = makeElement ('input', 'surname-input', formfieldSurname, '', 'name-input');
    formSurname.setAttribute('type', 'text');
    makeElement ('span', '', formfieldSurname, 'Фамилия ', 'formDescription');

    const formfieldMidname = makeElement('div', '', additionForm, '', 'form-field');
    const formMiddleName = makeElement ('input', 'midname-input', formfieldMidname, '', 'name-input');
    formMiddleName.setAttribute('type', 'text');
    makeElement ('span', '', formfieldMidname, 'Отчество ', 'formDescription');

    // дата рождения
    const formfieldBirth = makeElement('div', '', additionForm, '', 'form-field');
    const formBirth = makeElement ('input', 'birth-input', formfieldBirth, '', 'name-input');
    formBirth.setAttribute('type', 'date');
    makeElement ('span', '', formfieldBirth, 'Дата рождения ', 'formDescription');

    const formfieldYear = makeElement('div', '', additionForm, '', 'form-field');
    const formYear = makeElement ('input', 'year-input', formfieldYear, '', 'name-input');
    formYear.type = 'number';
    formYear.min = '2000';
    formYear.max = currentYear();
    formYear.step = '1';
    formYear.value = '2020';
    makeElement ('span', '', formfieldYear, 'Год начала обучения ', 'formDescription');

    const formfieldFaculty = makeElement('div', '', additionForm, '', 'form-field');
    const formFaculty = makeElement ('input', 'faculty-input', formfieldFaculty, '', 'name-input');
    formFaculty.setAttribute('type', 'text');
    makeElement ('span', '', formfieldFaculty, 'Факультет ', 'formDescription');

    const sendButton = makeElement('button', '', additionForm, "Добавить студента", 'button');
    sendButton.type = 'submit';
    const resetButton = makeElement('button', '', additionForm, "Очистить", 'button');
    resetButton.type = 'reset';

    additionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let checked = true;
      let warning = 'Исправьте ошибки в следующих полях: ';

      // проверка
      if (!formName.value.trim()) {
        checked = false;
        warning += '<br>• Имя';
      }
      if (!formSurname.value.trim()) {
        checked = false;
        warning += '<br>• Фамилия';
      }
      if (!formMiddleName.value.trim()) {
        checked = false;
        warning += '<br>• Отчество';
      }
      if (formBirth.value <= "1900-01-01") {
        checked = false;
        warning += '<br>• Дата рождения';
      }
      if (formYear.value < 2000 || formYear.value > currentYear()) {
        checked = false;
        warning += '<br>• Год начала обучения';
      }
      if (!formFaculty.value.trim()) {
        checked = false;
        warning += '<br>• Факультет';
      }
      warnings.innerHTML = warning;

      // добавить студента и очистить форму
      if (checked) {
        const newStudent = new student(formName.value.trim(), formSurname.value.trim(), formMiddleName.value.trim(), formBirth.value.replaceAll('-', '.'), formYear.value, formFaculty.value.trim());
        students.push(newStudent);
        additionForm.reset();
        console.log(students);
        warnings.textContent = '';
        printTable(students);
      }
    });

    const formFilter = makeElement('form', '', mainContainer, '', 'form-filter');
    makeElement('span', '', formFilter, 'Фильтр: ', 'filter-span');

    const filterName = makeElement('input', '', formFilter, '', 'filter');
    filterName.type = 'text';
    filterName.placeholder = "ФИО";

    const filterFaculty = makeElement('input', '', formFilter, '', 'filter');
    filterFaculty.placeholder = "Факультет";
    filterFaculty.type = 'text';

    const filterStart = makeElement('input', '', formFilter, '', 'filter');
    filterStart.type = 'number';
    filterStart.placeholder = 'Год начала обучения';

    const filterEnd = makeElement('input', '', formFilter, '', 'filter');
    filterEnd.type = 'number';
    filterEnd.placeholder = 'Год окончания обучения';

    const applyButton = makeElement('button', '', formFilter, "Применить", 'button');
    const resButton = makeElement('button', '', formFilter, "Сбросить", 'button');
    applyButton.type = 'submit';
    resButton.type = 'reset';
    resButton.addEventListener('click', (e) => printTable(students));

    formFilter.addEventListener('submit', (e) => {
      e.preventDefault();

      let filteredStudents = students;
      if (filterName.value) filteredStudents = filteredStudents.filter(student => ((student.surname + student.name + student.thirdName).toLowerCase().includes(filterName.value.toLowerCase())));
      if (filterFaculty.value) filteredStudents = filteredStudents.filter(student => student.faculty.toLowerCase().includes(filterFaculty.value.toLowerCase()));
      if (filterStart.value) filteredStudents = filteredStudents.filter(student => student.startYear === filterStart.value);
      if (filterEnd.value) filteredStudents = filteredStudents.filter(student => (Number(student.startYear) + 4) == filterEnd.value);


      printTable(filteredStudents);
    });

    printTable(students);

      let nameUnsorted = true;
      let facultyUnsorted = true;
      let birthUnsorted = true;
      let yearsUnsorted = true;


    // отображение данных
    function printTable(arr) {
      const prevTable = document.getElementById('table');
      if (prevTable) prevTable.remove();


      const table = makeElement('table', 'table', mainContainer, '', 'table'),
          thead = makeElement('thead', '', table, '', 'table-head'),
          tr = makeElement('tr', '', thead, '', 'table-row'),
          thName = makeElement('th', 'thName', tr, 'ФИО', 'table-data'),
          thFaculty = makeElement('th', 'thFaculty', tr, 'Факультет', 'table-data'),
          thBirth = makeElement('th', 'thBirth', tr, 'Дата рождения и возраст', 'table-data'),
          thYears = makeElement('th', 'thYears', tr, 'Годы обучения', 'table-data'),
          tBody = makeElement('tbody', '', table, '', 'table-body');

      for(let i=0; i < arr.length; i++) {
        const tr1 = makeElement('tr', '', tBody, '', 'table-row');
        makeElement('td', '', tr1, arr[i].surname +  ' ' + arr[i].name + ' ' + arr[i].thirdName, 'table-data');
        makeElement('td', '', tr1, arr[i].faculty, 'table-data');
        makeElement('td', '', tr1, tableAge(arr[i].birth), 'table-data');
        makeElement('td', '', tr1, years(arr[i].startYear), 'table-data');
      }
      // сортировочные свойства заголовка таблицы

      thName.addEventListener('click', (e) => {
        // сортировка по фио пузырьком
        let sortedArray = arr.slice();

        let j=0;
        let marker = true;
        while(j < sortedArray.length) {
          j++;
          marker = true;

          for (let i=1; i<sortedArray.length; i++)
            if (sortedArray[i].surname.toLowerCase() < sortedArray[i-1].surname.toLowerCase()) {
              change(i, i-1);
            } else if (sortedArray[i].surname.toLowerCase() == sortedArray[i-1].surname.toLowerCase()) {
              if (sortedArray[i].name.toLowerCase() < sortedArray[i-1].name.toLowerCase()) {
                change(i, i-1);
              } else if (sortedArray[i].name.toLowerCase() == sortedArray[i-1].name.toLowerCase()) {
                if (sortedArray[i].thirdName.toLowerCase() < sortedArray[i-1].thirdName.toLowerCase()) {
                  change(i, i-1);
                }
              }
            }
          if (marker) break;

          function change(a, b) {
            let temp = sortedArray[a];
            sortedArray[a] = sortedArray[b];
            sortedArray[b] = temp;
            marker = false;
          }
        }
        nameUnsorted = printOrderedData(nameUnsorted, sortedArray);
      })

      // сортировка по факультету
      thFaculty.addEventListener('click', (e) => {
        const sortedArray = sortStudentsArr('faculty', arr);
        facultyUnsorted = printOrderedData(facultyUnsorted, sortedArray);

      })

      // сортировка по дате рождения
      thBirth.addEventListener('click', (e) => {
        const sortedArray = sortStudentsArr('birth', arr);
        birthUnsorted = printOrderedData(birthUnsorted, sortedArray);

      })

      // сортировка по году начала обучения
      thYears.addEventListener('click', (e) => {
        const sortedArray = sortStudentsArr('startYear', arr);
        yearsUnsorted = printOrderedData(yearsUnsorted, sortedArray);

      })
    }

    // сортировка по одному параметру для таблицы
    function sortStudentsArr(param, arr) {
      let sortedArray = arr.slice();
        let j=0;
        let marker = true;

        while(j < sortedArray.length) {
          j++;
          marker = true;
          for (let i=1; i<sortedArray.length; i++)
            if (sortedArray[i][param].toLowerCase() < sortedArray[i-1][param].toLowerCase()) {
              let temp = sortedArray[i];
              sortedArray[i] = sortedArray[i-1];
              sortedArray[i-1] = temp;
              marker = false;
            }
          if (marker) break;
        }
        return sortedArray;
    }

    // выводит отсортиованный прямым или обратным способом массив. параметры - маркер сортировки данной колонки и прямо отсортированный массив для колонки
    function printOrderedData (switcher, array) {
      if (switcher) {
          printTable(array);
          switcher = false;
        } else {
          const reverseSorted = array.reverse();
          printTable(reverseSorted);
          switcher = true;
        }
        return switcher;
      }

    // номер курса для таблицы
    function years(y) {
      if ((currentYear() - y)>4) return ( y+' - ' + (Number(y)+4) + ' (закончил)')
      else return y + ' - ' + (Number(y)+4) + ' (' + (currentYear() - y + 1) + ' курс)';
    }

    // вывод возраста для таблицы
    function tableAge(str) {
      let age = currentYear() - str.substr(0, 4);
      return str.substr(8,2) + '.' + str.substr(5, 2) +'.' + str.substr(0, 4) + ' (возраст: ' + age + ')';
    }

    // текущий год
    function currentYear() {
      const currentTime = new Date();
      return currentTime.getFullYear();
    }

    // создание HTML элемента и его добавление куда-нибудь
    function makeElement (type, id = '', place = body, text = '', cls = '') {
      const elem = document.createElement(type);
      elem.textContent = text;
      elem.id = id;
      if (cls) elem.classList.add(cls);
      place.append(elem);
      return elem;
    }

    // тестовые данные
    function defaultData () {
      students.push(new student("Алексей", "Алексеев", "Алексеевич", "1902-12-12", "2008", "Прикладная метеорология"));
      students.push(new student("Ксения", "Ксенонова", "Ксениевна", "1992-11-09", "2018", "Переворачивание пингвинов"));
      students.push(new student("Альберт", "Альбертович", "Борисович", "2002-09-15", "2015", "Тестирование островов"));
      students.push(new student("Махиил", "Светланов", "Валерьевич", "1989-03-20", "2020", "Исследование аттракционов"));
      students.push(new student("Александр", "Петров", "Иванович", "1976-01-12", "2021", "Космические полеты"));
      students.push(new student("Елизавета", "Ленина", "Викторовна", "1955-02-01", "2019", "Подводные формы жизни"));
      students.push(new student("Елена", "Петрова", "Александровна", "1999-07-22", "2014", "Исследование коней в вакууме"));
      students.push(new student("Евстигней", "Иванов", "Алексеевич", "1987-06-02", "2010", "Дизайн пальто для коней"));
      students.push(new student("Алена", "Сидорова", "Алексеевна", "1998-04-15", "2016", "Художественная криптография"));
      students.push(new student("Дмитрий", "Дмитриев", "Дмитриевич", "2006-05-13", "2013", "Управление газонами"));
    }

  });
})();
