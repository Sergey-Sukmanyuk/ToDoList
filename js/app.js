//Получение необходимых елементов на странице

const clear = document.querySelector('.clear')
const  dateElement = document.querySelector('#date')
const list = document.querySelector('#list')
const input = document.querySelector('input')


//Присвоение переменных слассам которые будут динамических меняться

const CHECK = 'fa-check-circle'
const UNCHECK = 'fa-circle-thin'
const LINE_THROUGH = 'lineThrough'

//Переменные

let LIST, id

//Получение данных из localStorage

let data = localStorage.getItem('TODO')

if (data){
	LIST = JSON.parse(data)
	id = LIST.length
	loadList(LIST)
} else {
	LIST =[]
	id = 0
}

function loadList(array) {
	array.forEach(item => {
		addToDo(item.name, item.id, item.done, item.trash)
	})
}

//Полная очистка localStorage

clear.addEventListener('click', function(){
	localStorage.clear()
	location.reload()
})

//Установка текущей даты

const today = new Date()
const options = {weekday: 'long', month: 'short', day:'numeric'}
dateElement.innerHTML = today.toLocaleDateString('ru-RU', options)


//Отрисовка задания

function addToDo(task, id, done, trash){
	if(trash) return
	
	const DONE = done ? CHECK : UNCHECK
	const LINE = done ? LINE_THROUGH : ''
	
	const item = `<li class="item">
					<i class="fa ${DONE} co" job = "complete" id = ${id} ></i>
					<p class="text ${LINE}">${task}</p>
					<i class="fa fa-trash-o de" job = "delete" id = ${id}></i>
				</li>`
	const position = 'beforeend'
	
	list.insertAdjacentHTML(position, item)
}


//Добавление задания при нажатии на клавишу Enter

document.addEventListener('keyup', event => {
	if (event.keyCode == 13){
		const task = input.value
		
		if (task) {
			addToDo(task, id, false, false)
			
			LIST.push({
				name: task,
				id,
				done: false,
				trash: false,
			})
			//Добавляем данные в LocalStorage, чтобы они сохранялись при перезагрузке страницы(добавляем визде где обновляеться массив с 
			//задачами)
			localStorage.setItem('TODO', JSON.stringify(LIST))
			id++
		}
		input.value = ''
	}
	
})

//Переключение стилей когда меняем состояние выполнения задачи

function completeToDo(element){
	element.classList.toggle(CHECK)
	element.classList.toggle(UNCHECK)
	element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH)
	
	LIST[element.id].done = LIST[element.id].done ? false : true	
}

//Удаление задачи со списка

function removeToDo(element){
	element.parentNode.parentNode.removeChild(element.parentNode)
	
	LIST[element.id].trash = true
}

//Получаем element и вешаем слушатель событий для динамического изменения списка задач

list.addEventListener('click', event => {
	const element = event.target
	const jobElement = element.attributes.job.value 

	
	if (jobElement == 'complete') {
		completeToDo(element)
	} else if (jobElement == 'delete') {
		removeToDo(element)
	}

	localStorage.setItem('TODO', JSON.stringify(LIST))
})