const express = require('express'),
	http = require('http');
	bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    cors = require('cors');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(cors());
app.use(express.static(__dirname + "/public"));
var server = http.createServer(app).listen(7000, function() {
    console.log('info', 'Express server listening on port ' + 7000);
});


var fetchedData;
var maxBedrooms = 16;

//to fetch customized bedrooms data
// app.get('/sample', function(req, res) {
// 	//console.log(req.query.bedrooms);
// 	console.log(fetchedData);
// });

//to Fetch Data
app.get('/results', function(req, res) {
		//console.log(req.query.bedrooms);
	 
	// Applying Buy/Rent Filter
	 if(req.query.type == 'rent') {
	 	midUrl.filters.and[1].equal.listingCategory = ["Rental"];
	 }
	 else if(req.query.type == 'buy') {
	 	midUrl.filters.and[1].equal.listingCategory = ["Primary","Resale"];
	 }
	
	// Applying No of Bedrooms Filter
	var bedroomObjectArray = new Array();
	var bedroomsListInRequest = req.query.bedrooms;
	if(bedroomsListInRequest !== undefined) {
		var bedroomsSplitted = bedroomsListInRequest.split(',');
		var newBedroomsArray = new Array();
		for(var i in bedroomsSplitted) {
			newBedroomsArray.push(parseInt(bedroomsSplitted[i]));
		}
		var ifRequestContains3plus = false;
		for(var i=0; i<newBedroomsArray.length; i++) {
			if(newBedroomsArray[i] == 4)
				ifRequestContains3plus = true;
			else
				bedroomObjectArray.push(newBedroomsArray[i]);
		}
		if(ifRequestContains3plus == true) {
			for(var i=4; i<=maxBedrooms; i++)
				bedroomObjectArray.push(i);
		}
	}

	//If no bedrooms is selected
	else {
		for(var i=1; i<=maxBedrooms; i++)
			bedroomObjectArray.push(i);
	}
	midUrl.filters.and[2].equal.bedrooms = bedroomObjectArray;
	//console.log(JSON.stringify(midUrl));
	
	//Applying city Search Functionality
	var cityNameInRequest = req.query.cityName;
	//console.log(cityNameInRequest);
	let cityId;
	let cityIdMap = { 
		"ahmedabad": 1,
		"bangalore": 2,
		"chennai": 5,
		"delhi": 6,
		"ghaziabad": 8,
		"gurgaon": 11,
		"hyderabad": 12,
		"indore": 13,
		"mumbai": 18,
		"kolkata": 16,
		"noida": 20,
		"pune": 21,
		"lucknow": 23,
		"chandigarh": 24,
		"nagpur": 25
	}
	if(req.query.hasOwnProperty("cityName")) {
		let cityLoweCaseName = cityNameInRequest.toLowerCase();
		

	     midUrl.filters.and[0].equal.cityId = cityIdMap[cityLoweCaseName];
	 }
	 else
	 	midUrl.filters.and[0].equal.cityId = 11;	


	 //Applying Paging
	var startingPropertyNo = (req.query.pageNo-1)*20;
	//console.log(startingPropertyNo); 
	midUrl.paging.start = startingPropertyNo;


	//Applying Sorting Price Filter
	

	if(req.query.sortOrder !== undefined) {
		var sortOrder = req.query.sortOrder;
		console.log(sortOrder);
		if(sortOrder == "ASC")
			midUrl.sort = [{"field":"price","sortOrder":"ASC"}];
		else if(sortOrder == "DESC")
			midUrl.sort = [{"field":"price","sortOrder":"DESC"}];
		else if(sortOrder == "listingPopularityScore")
			midUrl.sort = [{"field":"listingPopularityScore","sortOrder":"DESC"}];
		else if(sortOrder == "listingSellerCompanyScore")
			midUrl.sort = [{"field":"listingSellerCompanyScore","sortOrder":"DESC"}];
		else if(sortOrder == "relevance")
			delete midUrl.sort;
	}

	var xhr = new XMLHttpRequest();
	var url = "https://" + initialUrl + JSON.stringify(midUrl) + endUrl;
	xhr.open("GET", url, true);
	xhr.send();
	//console.log(url);
	 xhr.onreadystatechange = function() {
	 	//console.log("On readyState change function  ");
	     if (xhr.readyState === 4) {

	     	//console.log("I am getting your data");
	       fetchedData = xhr.responseText;
	       res.send(JSON.parse(xhr.responseText)); //Outputs a DOMString by default
	     }
	   }
});


var initialUrl = "www.makaan.com/petra/app/v4/listing?selector=";
var endUrl = "&includeNearbyResults=false&includeSponsoredResults=false&sourceDomain=Makaan";
var midUrl = {
				"fields":
							[
							"localityId","displayDate","listing","property","project","builder",
							"displayName","locality","suburb","city","state","currentListingPrice","companySeller",
							"company","user","id","name","label","listingId","propertyId","projectId","propertyTitle",
							"unitTypeId","resaleURL","description","postedDate","verificationDate","size","measure",
							"bedrooms","bathrooms","listingLatitude","listingLongitude","studyRoom","servantRoom",
							"pricePerUnitArea","price","localityAvgPrice","negotiable","rk","buyUrl","rentUrl","overviewUrl",
							"minConstructionCompletionDate","maxConstructionCompletionDate","halls","facingId","noOfOpenSides",
							"bookingAmount","securityDeposit","ownershipTypeId","furnished","constructionStatusId",
							"tenantTypes","bedrooms","balcony","floor","totalFloors","listingCategory","possessionDate",
							"activeStatus","type","logo","profilePictureURL","score","assist","contactNumbers","contactNumber",
							"isOffered","mainImageURL","mainImage","absolutePath","altText","title","imageCount","geoDistance",
							"defaultImageId","updatedAt","qualityScore","projectStatus","throughCampaign","addedByPromoter",
							"listingDebugInfo","videos","imageUrl","rk","penthouse","studio","paidLeadCount",
							"listingSellerTransactionStatuses","allocation","allocationHistory","masterAllocationStatus","status",
							"sellerCompanyFeedbackCount","companyStateReraRegistrationId"
							],
				
				"filters":  {
								"and":
								[
									{"equal":{"cityId":11}},
									{"equal":{"listingCategory":["Primary","Resale"]}},
									{"equal":{"bedrooms":[]}}
								]
							},
				"paging":   {
								"start":0,
								"rows":20
							}
			};