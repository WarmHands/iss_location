//Инициализируем гугл карту с местоположение МКС с частотой обновления 10 секунд
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
	getISSCrew()
	//Указываем частоту обновления
	setInterval( () => {
		updateMap(map, marker)
	}, 2000)

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

			let latitude  = JSON.parse(XHR.responseText)["iss_position"].latitude
			let longitude = JSON.parse(XHR.responseText)["iss_position"].longitude

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
			// console.log(data);
			// console.log(data[0]);
			for (person in data) {
				if (data[person].craft == "ISS"){
					// console.log(data[person].name);

					let pilot_name = document.createElement('li');
					personName = data[person].name;
					pilot_name.innerHTML = "<div class='crew_container'></div>";
					document.getElementsByClassName("crew_container").innerHTML = personName;
					// console.log(pilot_name.innerHTML )
					pillist.prepend(pilot_name);
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