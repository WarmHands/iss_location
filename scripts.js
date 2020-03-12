//Инициализируем гугл карту с местоположение МКС с частотой обновления 10 секунд
var latitude;
var longitude;


var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var isscrew = 0; // Счетчик для экипажа МКС

function initMap() {
	// Указываем карту в объявленный <div id="map"></div> в html
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 8,
		mapTypeId: "satellite"
	});
	//Создаём маркер для МКС
	var marker = new google.maps.Marker({
		map: map,
		title: "ISS Location",
		icon: {
			url: "http://www.i2clipart.com/cliparts/9/1/8/b/clipart-international-space-station-918b.png",
			scaledSize: {width: 32, height: 32},
			anchor: {x: 64/4, y: 64/4}
		}
	});
	// Обновленяем карту и маркер
	updateMap(map, marker)
	updateInfo()
	getISSCrew() // Получаем список космонавтов
	//Указываем частоту обновления
	setInterval( () => {
		updateMap(map, marker);
		console.log(getFixedMinutes());
		updateInfo();
	}, 10000)

	// Функция для обновления данных
	function updateMap(map, marker) {
		getISSLocation()
		.then( (location) => {
			map.setCenter(location)
			marker.setPosition(location)
		})
	}
}

// Получаем данные о МКС и парсим местоположение
function getISSLocation() {

	return new Promise( (resolve, reject) => {
	let XHR = new XMLHttpRequest()

	XHR.open('GET', 'http://api.open-notify.org/iss-now.json')
	XHR.onload = function () {
		let location = {}
		if(XHR.readyState === 4 && XHR.status === 200) {

			latitude  = JSON.parse(XHR.responseText)["iss_position"].latitude
			longitude = JSON.parse(XHR.responseText)["iss_position"].longitude

			location = {
				lat: Number(latitude),
				lng: Number(longitude)
			}
			resolve(location)
		} else {
			reject(XHR.statusText)
		}
	}

	XHR.send()

	})
}


function getISSCrew() {
	var personName = ""
	return new Promise( (resolve, reject) => {
	let XHR = new XMLHttpRequest()

	XHR.open('GET', 'http://api.open-notify.org/astros.json')
	XHR.onload = function () {
		let crew = {}
		if(XHR.readyState === 4 && XHR.status === 200) {

			let data  = JSON.parse(XHR.responseText).people

			for (person in data) {
				if (data[person].craft == "ISS"){
					$('#crewList').append('<li>'+data[person].name+'</li>');
				}
			}

			resolve(data)
		} else {
			reject(XHR.statusText)
		}
	}

	XHR.send()

	})
}



function getFixedMinutes() // Чтобы избежать всяких 20:2, т.к. значения от getUTCMinutes() находятся в диапазоне 0-59
{
	let d = new Date();
	if (d.getUTCMinutes() < 10)
	{
		return "0" + d.getUTCMinutes();
	} else {
		return d.getUTCMinutes();
	}
}

function updateInfo(){
	let d = new Date();
	$('#issLocation').html("Longtitude: " + longitude +", Latitude: " + latitude);
	$('#utcTime').html("Current UTC time: " + d.getUTCHours() + ":" + getFixedMinutes());
	$('#dayMonthYear').html(days[d.getUTCDay()] + ", " + d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear());
};