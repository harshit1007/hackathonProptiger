/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
var isTypeBuy = false;
var isTypeRent = false;
var serverURL = "http://localhost:7000/results";
var currentPage = 1;
var fetchedData;

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function myFunctionBedroom() {
    document.getElementById("myDropdownBedroom").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}

function applyBedroomFilter() {
    currentPage = 1;
    resetAllPageNoColor();
    set1stPageColor();
    var isAnyBedroomChecked = false;
    for (var i = 1; i <= 4; i++) {
        if (document.getElementById("c" + i).checked == true)
            isAnyBedroomChecked = true;
    }
    if (isTypeRent == false && isTypeBuy == false) {
        alert("Please Select Property Type First..!!!");
        return;
    }
    if (isAnyBedroomChecked == false) {
        bedroomList = [1, 2, 3, 4];
        document.getElementById("currentBedroomType").innerHTML = "Bedroom";
    } else {
        var bedroomList = [];
        for (var i = 1; i <= 4; i++) {
            if (document.getElementById("c" + i).checked == true)
                bedroomList.push(i);
        }
    }
    //Make 4 to 3+ to show on button
    var bedroomListWith3plus = JSON.parse(JSON.stringify(bedroomList));
    if (bedroomListWith3plus.includes(4))
        bedroomListWith3plus[bedroomListWith3plus.indexOf(4)] = "3+";
    if (isAnyBedroomChecked)
        document.getElementById("currentBedroomType").innerHTML = bedroomListWith3plus.toString() + " BHK";

    /* By API fetch */
    var url = new URL(serverURL);
    if (isTypeBuy == true)
        url.searchParams.append("type", "buy");
    else
        url.searchParams.append("type", "rent");
    url.searchParams.append("bedrooms", bedroomList);

    //Apply Bedroom Filter according to the city name in search field

    if (getCityNameFromSearchField() !== "") {
        url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    }


    fetchData(url.toString());
}

function sortByPrice(mechanism) {
    currentPage = 1;
    resetAllPageNoColor();
    set1stPageColor();
    if (isTypeRent == false && isTypeBuy == false) {
        alert("Please Select Property Type First..!!!");
        return;
    }

    if (mechanism == "ASC") {
        resetColorOfAllSortings();
        document.getElementById("sortAsc").style.backgroundColor = "grey";
        document.getElementById("currentSortingType").innerHTML = "Sort By: Price (Low to High)";

    } else if (mechanism == "DESC") {
        resetColorOfAllSortings();
        document.getElementById("sortDesc").style.backgroundColor = "grey";
        document.getElementById("currentSortingType").innerHTML = "Sort By: Price (High to Low)";
    } else if (mechanism == "relevance") {
        resetColorOfAllSortings();
        document.getElementById("sortrelevance").style.backgroundColor = "grey";
        document.getElementById("currentSortingType").innerHTML = "Sort By: Relevance";
    } else if (mechanism == "listingPopularityScore") {
        resetColorOfAllSortings();
        document.getElementById("sortpopularity").style.backgroundColor = "grey";
        document.getElementById("currentSortingType").innerHTML = "Sort By: Popularity";
    } else if (mechanism == "listingSellerCompanyScore") {
        resetColorOfAllSortings();
        document.getElementById("sortlistingSellerCompanyScore").style.backgroundColor = "grey";
        document.getElementById("currentSortingType").innerHTML = "Sort By: Seller Rating";
    }
    console.log(mechanism);
    var url = new URL(serverURL);
    if (isTypeBuy == true)
        url.searchParams.append("type", "buy");
    else
        url.searchParams.append("type", "rent");
    var bedroomList = [];
    var isAnyBedroomChecked = false;
    for (var i = 1; i <= 4; i++) {
        if (document.getElementById("c" + i).checked == true) {
            isAnyBedroomChecked = true;
            bedroomList.push(i);
        }
    }
    if (isAnyBedroomChecked == false)
        bedroomList = [1, 2, 3, 4];
    url.searchParams.append("bedrooms", bedroomList);

    //Apply Bedroom Filter according to the city name in search field

    if (getCityNameFromSearchField() !== "") {
        url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    }
    url.searchParams.append("sortOrder", mechanism);
    console.log(url.toString());
    fetchData(url.toString());
}

function getCurrentType() {
    if (isTypeRent == true)
        return "Rent";
    if (isTypeBuy == true)
        return "Buy";
}

function setCurrentType(propertyType) {
    if (propertyType == "rent") {
        isTypeRent = true;
        isTypeBuy = false;
        document.getElementById("currentType").innerHTML = "Rent";
    } else
    if (propertyType == "buy") {
        isTypeRent = false;
        isTypeBuy = true;
        document.getElementById("currentType").innerHTML = "Buy";
    }
}

function renderProperties(propertiesData) {
    var listOfCards = document.createElement("ul");
    var resaleURLs = [];
    var propertiesList = propertiesData.data[0].facetedResponse.items;
    for (var iterator = 0; iterator < 20; iterator++) {
        var property = propertiesList[iterator].listing;
        resaleURLs.push(property.resaleURL.toString());
        //console.log(resaleURLs[iterator].toString());
        var card = document.createElement('div');
        card.className = "card";
        var imageWrap = document.createElement('div');
        imageWrap.className = "property-image";
        var img = document.createElement('img');
        img.src = property.mainImageURL.toString();
        imageWrap.appendChild(img);
        card.appendChild(imageWrap);
        var content = document.createElement('div');
        content.style.fontWeight = "bold";
        content.className = "property-content";
        var propertyTitle = document.createElement("h3");
        propertyTitle.className = "property-title";
        content.appendChild(propertyTitle);
        var text = document.createTextNode(property.property.bedrooms.toString() + "  " + "BHK" + "  " + property.property.unitType.toString());
        content.appendChild(text);
        //var text = document.createTextNode(property.property.unitName.toString());
        var location = document.createTextNode(property.property.project.locality.suburb.label + ", " + property.property.project.locality.label.toString() + ", " + property.property.project.locality.suburb.city.label.toString());
        content.appendChild(document.createElement('br'));
        content.appendChild(document.createElement('br'));
        content.appendChild(location);
        content.appendChild(document.createElement('br'));
        card.appendChild(content);
        var listing_highlights = document.createElement('div');
        listing_highlights.className = "listing-highlights";
        var hcol = document.createElement('div');
        hcol.className = "hcol";
        var price = document.createElement('div');
        price.className = "price";
        var rupee = document.createElement('STRONG');
        rupee.className = "rupee";
        var txt1 = document.createTextNode("₹ " + " ");
        rupee.appendChild(txt1);
        price.appendChild(rupee);
        var val = document.createElement('span');
        val.className = "val";
        var txt2 = document.createTextNode(convertPrice(property.currentListingPrice.price).val + "  ");
        val.appendChild(txt2);
        price.appendChild(val);
        var unit = document.createElement('span');
        unit.className = "unit";
        var txt3 = document.createTextNode(convertPrice(property.currentListingPrice.price).unit + "  ");
        unit.appendChild(txt3);
        price.appendChild(unit);
        hcol.appendChild(price);
        var lbl = document.createElement('div');
        lbl.className = "lbl";
        var txt4 = document.createTextNode("₹ " + property.currentListingPrice.pricePerUnitArea + "    per sq ft ");
        if (property.listingCategory !== "Rental")
            lbl.appendChild(txt4);
        hcol.appendChild(lbl);
        listing_highlights.appendChild(hcol);
        var hcol1 = document.createElement('div');
        hcol1.className = "hcol";
        var size = document.createElement('div');
        size.className = "size";
        var val1 = document.createElement('span');
        val1.className = "val";
        var txt5 = document.createTextNode(property.property.size);
        val1.appendChild(txt5);
        size.appendChild(val1);
        hcol1.appendChild(size);
        var lbl1 = document.createElement('div');
        lbl1.className = "lbl";
        var txt5 = document.createTextNode("Area in sq ft");
        lbl1.appendChild(txt5);
        hcol1.appendChild(lbl1);
        listing_highlights.appendChild(hcol1);
        card.appendChild(listing_highlights);
        var listing_details = document.createElement('div');
        listing_details.className = "listing-details";
        var listing_details_data = document.createElement('span');
        listing_details_data.className = "listing-details-data";
        var x = document.createElement("STRONG");
        var str;
        if (property.listingCategory !== "Rental") {
            var date = convDate(property.property.project.possessionDate);
            if (date == "Not Available")
                str = property.furnished;
            else
                str = "Possession By: " + convDate(property.property.project.possessionDate);
        } else
            str = property.furnished;
        var t = document.createTextNode(str);
        x.appendChild(t);
        var contactSeller = document.createElement("div");
        var sellerName = document.createTextNode("Seller: " + property.companySeller.company.name);
        var builderName = document.createTextNode("Builder: " + property.property.project.builder.name);
        contactSeller.appendChild(sellerName);
        x.appendChild(contactSeller);
        if (property.property.project.builder.name !== "Builder")
            x.appendChild(builderName);
        listing_details_data.appendChild(x);
        listing_details.appendChild(document.createElement('br'));
        listing_details.appendChild(listing_details_data);
        card.appendChild(listing_details);
        listOfCards.appendChild(card);
    }
    document.querySelector(".listOfProperties").innerHTML = listOfCards.innerHTML;
    var allContents = document.querySelectorAll(".property-content");
    for (var i = 0; i < allContents.length; i++) {
        let currentURL = resaleURLs[i];
        allContents[i].addEventListener("click", function() {
            var propertyProductionURL = "http://www.makaan.com/" + currentURL;
            var propertyPage = window.open(propertyProductionURL);
            propertyPage.focus();
        });
    }
}


[]
convertPrice = function(num) {
    if (num >= 10000000) {
        return {
            'val': Number(num / 10000000).toFixed(2),
            'unit': 'Cr'
        };
    } else if (num >= 100000) {
        return {
            'val': Number(num / 100000).toFixed(2),
            'unit': 'L'
        };
    } else {
        return {
            'val': Number(num / 1000).toFixed(2),
            'unit': 'K'
        };
    }
}
convDate = function(d) {
    if (d == undefined)
        return "Not Available";
    d = new Date(d);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return (months[d.getUTCMonth()] + ' ' + d.getUTCFullYear());
}

function fetchData(url) {
    url += "&pageNo=" + currentPage;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            fetchedData = JSON.parse(xhr.response);
            renderProperties(fetchedData);
        }
    }
}

function buyFunction() {
    currentPage = 1;
    setCurrentType("buy");
    document.getElementById("currentBedroomType").innerHTML = "Bedroom";
    document.getElementById("currentSortingType").innerHTML = "Sort By";
    var url = new URL(serverURL);
    url.searchParams.append("type", "buy");
    url.searchParams.append("sortOrder", "relevance");
    var bedroomList = [1, 2, 3, 4];
    url.searchParams.append("bedrooms", bedroomList);
    //Apply Buy Filter According to city name in search field
    if (getCityNameFromSearchField() !== "") {
        url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    }
    resetColorOfAllSortings();
    document.getElementById("sortrelevance").style.backgroundColor = "grey";
    clearBedroomEntries();
    fetchData(url.toString());
    resetAllPageNoColor();
    set1stPageColor();
    resetPaginationColorBlack();
}

function rentFunction() {
    currentPage = 1;
    document.getElementById("currentBedroomType").innerHTML = "Bedroom";
    document.getElementById("currentSortingType").innerHTML = "Sort By";
    setCurrentType("rent");
    var url = new URL(serverURL);
    url.searchParams.append("type", "rent");
    url.searchParams.append("sortOrder", "relevance");
    //Apply rent filter aaccording to the city name in the search field
    if (getCityNameFromSearchField() !== "") {
        url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    }
    var bedroomList = [1, 2, 3, 4];
    url.searchParams.append("bedrooms", bedroomList);
    resetColorOfAllSortings();
    clearBedroomEntries();
    document.getElementById("sortrelevance").style.backgroundColor = "grey";
    fetchData(url.toString());
    resetAllPageNoColor();
    set1stPageColor();
    resetPaginationColorBlack();
}
//Function to clear bedroom filter entries when some other property type is chosen - Buy/Rent!
function clearBedroomEntries() {
    for (var i = 1; i <= 4; i++) {
        document.getElementById("c" + i).checked = false;
    }

}
function searchCityFunction() {
    currentPage = 1;
    if (isTypeRent == false && isTypeBuy == false) {
        document.getElementById("searchTextField").value = "";
        alert("Please Select Property Type First..!!!");
        return;
    }
    document.getElementById("currentSortingType").innerHTML = "Sort By";
    var url = new URL(serverURL);
    url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    clearBedroomEntries();
    resetColorOfAllSortings();
    document.getElementById("sortrelevance").style.backgroundColor = "grey";
    var bedroomList = [1, 2, 3, 4];
    url.searchParams.append("bedrooms", bedroomList);
    document.getElementById("currentBedroomType").innerHTML = "Bedroom";
    url.searchParams.append("sortOrder", "relevance");
    console.log(url.toString());
    fetchData(url.toString());
    resetAllPageNoColor();
    set1stPageColor();
    resetPaginationColorBlack();
}
function getCityNameFromSearchField() {
    return document.getElementById("searchTextField").value;
}
function pageNoClicked(pageNo) {
    window.scrollTo(0, 0);
    currentPage = pageNo;
    var url = new URL(serverURL);
    if (isTypeBuy == true)
        url.searchParams.append("type", "buy");
    else
        url.searchParams.append("type", "rent");
    var bedroomList = [];
    var isAnyBedroomChecked = false;
    for (var i = 1; i <= 4; i++) {
        if (document.getElementById("c" + i).checked == true) {
            isAnyBedroomChecked = true;
            bedroomList.push(i);
        }
    }
    if (isAnyBedroomChecked == false)
        bedroomList = [1, 2, 3, 4];
    url.searchParams.append("bedrooms", bedroomList);

    //Apply Bedroom Filter according to the city name in search field

    if (getCityNameFromSearchField() !== "") {
        url.searchParams.append("cityName", document.getElementById("searchTextField").value);
    }
    fetchData(url.toString());
    resetAllPageNoColor();
    document.getElementById("p" + pageNo).style.backgroundColor = "grey";

}

function resetAllPageNoColor() {
    for (var i = 0; i <= 7; i++) {
        document.getElementById("p" + i).style.backgroundColor = "white";
    }
}

function set1stPageColor() {
    document.getElementById("p1").style.backgroundColor = "grey";
}

function resetPaginationColorBlack() {
    for (var i = 0; i <= 7; i++) {
        document.getElementById("p" + i).style.color = "black";
    }
}

function resetColorOfAllSortings() {
    document.getElementById("sortAsc").style.backgroundColor = "white";
    document.getElementById("sortDesc").style.backgroundColor = "white";
    document.getElementById("sortrelevance").style.backgroundColor = "white";
    document.getElementById("sortpopularity").style.backgroundColor = "white";
    document.getElementById("sortlistingSellerCompanyScore").style.backgroundColor = "white";
}