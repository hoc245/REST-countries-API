// SWITCH THEME
const switchBtn = $('.toggle-mode');
switchBtn.click(function(){
    if($('html').attr('data-theme') === "dark") {
        $('html').attr('data-theme','light')
    } else {
        $('html').attr('data-theme','dark')
    }
})
// Input
const inputText = $('#searchbar')

inputText.keyup(function(e) {
    var countries = document.getElementsByClassName('countries-item');
    var val = inputText.val();
    if (e.keyCode === 13) {
        e.preventDefault();
    }
    if (val !== "") {
        var regex = RegExp(val + "*","i");
        for (let i = 0; i < countries.length; i++) {
            if(regex.test(countries[i].lastElementChild.firstElementChild.innerHTML)) {
                countries[i].style.display = 'block';
            } else {
                countries[i].style.display = 'none';
            }
        }
    }
})
// Filter button
const selected = $('#selected');
const selectedText = $('#selected p');
const unselect = $('#unselect');
const unselectItem = $('#unselect div');
selected.click(function(){
    selected.toggleClass('open');
})
for (let i = 0; i < unselectItem.length; i++) {
    unselectItem[i].addEventListener('click',function(){
        var val = unselectItem[i].innerHTML;
        selectedText.html(val);
        selected.removeClass('open');
        if(val === "All") {
            callAJAX(url + val.toLowerCase())
        } else {
            regionFilter = val;
            callAJAX(url + "region/" + val);
        }
    })
}
// Create contains Object
var mObj = {
    imgsrc : "",
    name : "",
    population : "",
    region : "",
    capital : "",
}
// Create Element
function createEle() {
    var countriesItem = document.createElement('div');
    var flag = document.createElement('div');
    var flagImage = document.createElement('img');
    var info = document.createElement('div');
    var name = document.createElement('h1');
    var population = document.createElement('p');
    var region = document.createElement('p');
    var capital = document.createElement('p');
    // Adding Class
    countriesItem.classList.add('countries-item');
    countriesItem.setAttribute('onclick','moreDetail(this)');
    flag.classList.add('flag');
    flagImage.classList.add('flag-image');
    flagImage.setAttribute('alt','flag-country-image');
    info.classList.add('info');
    name.classList.add('name');
    population.classList.add('population');
    region.classList.add('region');
    capital.classList.add('capital');
    // Add content
    flagImage.setAttribute('src',mObj.imgsrc);
    name.innerHTML = mObj.name;
    population.innerHTML = "Population:" + "<span>" + mObj.population + "</span>";
    region.innerHTML = "Region:" + "<span>" + mObj.region + "</span>";
    capital.innerHTML = "Capita:" + "<span>" + mObj.capital + "</span>";
    // Append
    info.appendChild(name);
    info.appendChild(population);
    info.appendChild(region);
    info.appendChild(capital);
    flag.appendChild(flagImage);
    countriesItem.appendChild(flag);
    countriesItem.appendChild(info);
    document.getElementById('countries-list').appendChild(countriesItem);
}
// Delete Element
function deleteEle() {
    var counstries = $('.countries-item');
    counstries.remove();
}
// AJAX
var url = "https://restcountries.eu/rest/v2/";
// Call AJAX first load (all countries)
callAJAX(url + "all");
function callAJAX(n) {
    $.ajax({
        url : n,
        success : function(data){
            deleteEle();
            for (let i = 0; i < data.length; i++) {
                mObj.imgsrc = data[i].flag;
                mObj.name = data[i].name;
                mObj.population = data[i].population;
                mObj.region = data[i].region;
                mObj.capital = data[i].capital;
                createEle();
            }
        }
    })
}
// POPUP DETAIL
$('#slider-btn').click(function(){
    $('#main').removeClass('openDetail');
})
function moreDetail(n) {
    // Current Object contains current data of clicked country
    var currentObject = {
        flag : "",
        name : "",
        population : "",
        region : "",
        capital : "",
        subregion: "",
        nativeName: "",
        topLevelDomain: [],
        currencies: [],
        languages : [],
        borders: [],
    }
    // Get the name of clicked country
    if (n.childElementCount === 0) {
        var name = n.innerHTML;
    } else {
        var name = n.lastElementChild.firstElementChild.innerHTML;
    }
    // Add name to slider
    $('#slider-name').html(name);
    // Apply data to slider
    function applyDetail() {
        var innerText = $('#slider-detail span');
        // For string data
        for (let i = 0 ; i < innerText.length; i++) {
            var nameProper = innerText[i].getAttribute('data-value');
            innerText[i].innerHTML = currentObject[nameProper];
            // For array data
            if (nameProper === "currencies") {
                innerText[i].innerHTML = currentObject[nameProper][0].code;
            } else if (nameProper === "languages") {
                var newString = "";
                for (let i = 0 ; i < currentObject[nameProper].length ; i++) {
                    newString += ", " + currentObject[nameProper][i].name;
                }
                innerText[i].innerHTML = newString.slice(2);
            }
        }
    }
    // Create border button
    function createBorder() {
        $("#slider-geography .border-countries").remove();
        for(let i = 0; i < currentObject["borders"].length; i++) {
            // Ajax to change the CODE to NAME
            $.ajax({
                url: "https://restcountries.eu/rest/v2/alpha/" + currentObject["borders"][i],
                success : function(data) {
                    var container = document.createElement('span');
                    container.classList.add('border-countries');
                    // Create function for each border button
                    container.setAttribute('onclick','borderNextCountry(this)');
                    container.innerHTML = data.name;
                    $('#slider-geography').append(container);
                }
            })
        }
    }
    // AJAX to get Data for current Object base on name
    $.ajax({
        url : url + "name/" + name,
        success : function(data) {
            $('#slider-flag img').attr('src',data[0].flag)
            var dataObject = data[0];
            for (i in currentObject) {
                currentObject[i] = dataObject[i];
            }
            applyDetail();
            createBorder();
            $('#main').addClass('openDetail')
        }
    })
}
// Define function for border button
function borderNextCountry(ele) {
    var name = ele.innerHTML;
    moreDetail(ele);
}
