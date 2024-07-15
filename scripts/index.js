// Because... scrapping ??
let visualCrossing = "WlVQTUZIQVpTNFlUV00zOEpBQlJSU0hMUA==";

// Elements selection
let form = document.getElementById("queryForm");

// Event Listeners
form.addEventListener("submit", (event) => {
	event.preventDefault();
	let locationField = document
		.getElementById("location")
		.value.replace(/\s/g, "");

	//Method for the Api Call and assign results to the DOM tree
	getQueryInformation(locationField)
		.then((response) => {
			//Hide all the messages in the DOM tree and show the variables
			hideAllMessages();
			assignQueryInformation(response);
		})
		.catch((error) => {
			//Show the error message in the DOM tree
			queryErrorShow();
			console.error(error);
		});
});

// Function to retrieve the JSON representation of the Weather Information Query
async function getQueryInformation(location) {
	let safeUrlLocation = encodeURIComponent(location);

	//It's kinda silly honestly...
	let visualCrossingDecoded = atob(visualCrossing);

	//Building the query URL for API request
	let queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${safeUrlLocation}?unitGroup=metric&key=${visualCrossingDecoded}&contentType=json`;

	//Building the Request for API
	let request = new Request(queryUrl, {
		method: "GET",
	});

	//Managing the fetch request and response
	try {
		let response = await fetch(request);

		if (response.status === 200) {
			return await response.json();
		} else {
			console.error(`Error: ${response.status} - Invalid Search`);
		}
	} catch (error) {
		console.log(error);
	}
}

function assignQueryInformation(responseJson) {
	let queryInformation = {};

	//Isolate information from the response
	queryInformation["locationLong"] = responseJson["resolvedAddress"];
	queryInformation["latitude"] = responseJson["latitude"];
	queryInformation["longitude"] = responseJson["longitude"];
	queryInformation["timeZone"] = responseJson["timezone"];
	queryInformation["temperature"] = responseJson["currentConditions"]["temp"];
	queryInformation["temperatureFeelsLike"] =
		responseJson["currentConditions"]["feelslike"];
	queryInformation["climateDescription"] = responseJson["description"];
	queryInformation["currentCondition"] =
		responseJson["currentConditions"]["conditions"];

	//Assign the query information to the corresponding span object
	for (let field of Object.keys(queryInformation)) {
		document.getElementById(field).innerHTML = queryInformation[field];
	}
}

function queryErrorShow() {
	//Show the node in the DOM tree
	document.querySelectorAll(".mapError").forEach((childNode) => {
		childNode.classList.remove("hidden");
	});

	//Show the error message
	document.querySelectorAll(".mapError > p").forEach((childNode) => {
		childNode.innerHTML = "Invalid query, try again.";
	});

	//Hide the query information
	document.querySelector(".variables").classList.add("hidden");
}

function hideAllMessages() {
	//Hide the node in the DOM tree
	document.querySelectorAll(".mapError").forEach((childNode) => {
		childNode.classList.add("hidden");
	});

	//Show the query information
	document.querySelector(".variables").classList.remove("hidden");
}
