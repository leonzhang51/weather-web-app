/**
 * Weather APP TP2
 * programmeur: zhang lie 
 * date: 2019-9-13
 */

// Pour convertir °K -> °C : °C = °K - 273.15
const ZERO_ABS = -273.15;

/**
 * Réaliser quelques conversion utiles
 */
const CONV = {
    /**
     * Convertir °K -> °C
     */
    k_a_c: k => (k + ZERO_ABS).toFixed(1),

    /**
     * Fournir heure au format hh:mm à partir d'un timestamp
     */
    dt_a_hm: dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0, 2);
    }

}

/**
 * Latitude et longitude de la ville de montréal 
 */
const MONTREAL = {
    lat: 45.508320,
    lon: -73.566431,
};

/**
 * Petit objet pour gérer les URLs de l'API 
 */
const OW_API = {
    base_api_url: 'https://api.openweathermap.org/data/2.5/',
    base_icon_url: 'https://openweathermap.org/img/w/',
    weather: 'weather?lat={lat}&lon={lon}',
    forecast: 'forecast?lat={lat}&lon={lon}',
    key: '&APPID=1fef58d58c303010102d71990b5d448e',

    //http://api.openweathermap.org/data/2.5/weather?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_weather_url: function (lat, lon) {
        return this.base_api_url + this.weather.replace('{lat}', lat).replace('{lon}', lon) + this.key;
    },

    //http://api.openweathermap.org/data/2.5/forecast?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_forecast_url: function (lat, lon) {
        return this.base_api_url + this.forecast.replace('{lat}', lat).replace('{lon}', lon) + this.key;
    },

    //http://openweathermap.org/img/w/10d.png
    get_icon_url: function (icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};
//chercher la ville dans la liste
function chercherVilleList() {
    let nomVilleChercher = $("#searchVille").val().toLowerCase();
    //console.log("val is: "+nomVilleChercher);
    matchlist(nomVilleChercher);
}
$("#actionSearchVille").click(chercherVilleList);

function matchlist(ville) {
    //localStorage.removeItem("temporaryVille");
    let trouverVille = 'false';
    try {
        $.getJSON("city.list.json", function (data) {

            for (let i = 0; i < data.length; i++) {
                if (ville == data[i].name.toLowerCase()) {

                    localStorage.setItem("temporaryVille", JSON.stringify(data[i]));
                    $("#resultVilleSearch").text("La " + JSON.parse(localStorage.getItem("temporaryVille")).name + " a touver dans la liste!");
                    trouverVille = 'true';
                    //console.log(trouverVille+ville)
                    break;
                }
            }
            if (trouverVille === 'false') {

                $("#resultVilleSearch").text("pas trouver la ville dans notre liste, essayer autre nom de ville svp!");
            }

        });
    } catch (err) {
        console.log(err);
        $("#err").text(err);
    }

}

//afficher ville list dans homepage et setup page
$(function () {
    //get data from local storage then put city name to city liste
    try {
        if (JSON.parse(localStorage.getItem("listeVille"))) {
            let listeNom = JSON.parse(localStorage.getItem("listeVille")).map(name => name.name); //get city name from obj
            for (let i = 0; i < listeNom.length; i++) {
                $("#villeChanger").append("<option value='" + i + "'>" + listeNom[i] + "</option>");
                $("#villePrefer").append("<option value='" + i + "'>" + listeNom[i] + "</option>");
            }
        }
    } catch (err) {
        console.log(err);
        $("#err").text(err);
    }

});

//ajoute la villde a liste de la ville de prefer
$("#ajouterListeVille").click(ajouterListeVille);

function ajouterListeVille() {
    var listeVille = []; //save 5 city info client choosed (obj it included all the info for city like name, id, geo info etc)
    let temporaryVille = ""; //save city info entered which matched city list provided
    try {
        if (JSON.parse(localStorage.getItem("temporaryVille"))) {
            temporaryVille = JSON.parse(localStorage.getItem("temporaryVille"));
            console.log("name de ville will be added: " + temporaryVille.name);
        }

        if (!JSON.parse(localStorage.getItem("listeVille"))) {
            if (temporaryVille !== "") {
                //listeVille.push(temporaryVille);
                listeVille.push(temporaryVille);
                console.log(typeof (temporaryVille));
                localStorage.setItem("listeVille", JSON.stringify(listeVille));
            }

        } else {
            listeVille = JSON.parse(localStorage.getItem("listeVille"));
            console.log("local liste de ville is: " + listeVille);
            let listeNom = JSON.parse(localStorage.getItem("listeVille")).map(name => name.name);

            if (temporaryVille !== "" && !listeNom.includes(temporaryVille.name)) {
                if (listeVille.length < 5) {
                    listeVille.push(temporaryVille);
                    localStorage.setItem("listeVille", JSON.stringify(listeVille));
                } else {
                    listeVille.shift();
                    listeVille.push(temporaryVille);
                    localStorage.setItem("listeVille", JSON.stringify(listeVille));
                }

            } else {
                alert("can not add duplicate city");
            }


        }

    } catch (err) {
        console.log(err);
        $("#err").text(err);
    }

    location.reload(); //reload page

    //console.log(JSON.parse(localStorage.getItem("listeVille")));
}

//enregistrer tous les changements de paramètres utilisateur
$("#saveSetting").click(function () {
    try {
        localStorage.setItem("celsius", $("#celsius").prop("checked")); //save celsius setting to localstorage
        if ($("#villePrefer").val() !== "Choisir la ville") { //get city id
            if(Number.isInteger(parseInt($("#villePrefer").val()))){
                localStorage.setItem("villeId", $("#villePrefer").val());
                location.reload(true);
            }
            
        } else {
            alert("Choisir la ville svp!");
        }

    } catch (err) {
        console.log(err);
        $("#err").text(err);
    }

    //location.reload();
});
//change city info in homepage
$("#villeConfirm").click(function () {
    console.log($("#villeChanger").val());
    try {
            //get city id
        if (Number.isInteger(parseInt($("#villeChanger").val()))) 
        { 
            localStorage.setItem("villeId", $("#villeChanger").val());
            let villeId = JSON.parse(localStorage.getItem("villeId"));
            let listeVille = JSON.parse(localStorage.getItem("listeVille"));
            let celsius = JSON.parse(localStorage.getItem("celsius"));
            showWeather(listeVille[villeId].coord.lat, listeVille[villeId].coord.lon, celsius);
            //$("#villeInfo").text(listeVille[villeId].name);
            location.reload();
        } else {
            alert("Choisir la ville svp!");
            
        }

    } catch (err) {
        console.log(err);
        $("#err").text(err);
    }
})

//cree carte 
for (let i = 0; i < 24; i++) {


    $(".row").append("<div  class='text-center col-sm-3 mb-4' id=" + i + "><span class='preview'></span></div>");
    $("#" + i).append([
     $('<div/>', {
            'class': 'card'
        }).append([
         ("<p class='icone card-img-top'><img src='' alt='' class='val' /></p>"),
         ("<h5 class='card-title'>Météo actuelle</h5>"),
         ("<div class='card-body'><p class='temperature'>Il fait: <span class='val'></span></p><p class='description'>Le ciel est: <span class='val'></span></p><p class='precipitation'>La precipitation est: <span class='val'></span></p></div>")
     ])
    ]);

}
//afficher donne de Météo dans card
function showWeather(lat, lon, celsius) {
    $.getJSON(OW_API.get_forecast_url(lat, lon), function (data, status) {
        //value for current ; 
        $(".card .heure").text(CONV.dt_a_hm(data.list[0].dt));
        if (celsius) {
            $(".card .card-body .temperature span").text(CONV.k_a_c(data.list[0].main.temp)+" C");
        } else {
            $(".card .card-body .temperature span").text(data.list[0].main.temp+" F");
        }

        $(".card .card-body .icone img").attr({
            "src": OW_API.get_icon_url(data.list[0].weather[0].icon),
            "alt": ""
        });
        $(".card .card-body .description span").text(data.list[0].weather[0].description);
        if (data.list[0].hasOwnProperty("rain")) {
            $(".card .card-body .precipitation1 .val").text(data.list[0].rain["3h"]);
        }
        else{
            $(".card .card-body .precipitation1 .val").text("Pas de données");
        }
        //console.log(data.city.name);
        $("#villeInfo").text(data.city.name);
        //value for prevision
        for (let i = 0; i < 24; i++) {
            //$("#"+i +" .preview").text(data.list[i].dt_txt);
            //$("#"+i).text(CONV.dt_a_hm(data.list[i].dt));
            $("#" + i + " h5").text(data.list[i].dt_txt);
            if (celsius) {
                $("#" + i + " .temperature span").text(CONV.k_a_c(data.list[i].main.temp)+" C");
            } else {
                $("#" + i + " .temperature span").text(data.list[i].main.temp+" F");
            }

            $("#" + i + " .icone img").attr({
                "src": OW_API.get_icon_url(data.list[i].weather[0].icon),
                "alt": ""
            });
            $("#" + i + " .description span").text(data.list[i].weather[0].description);

            if (data.list[i].hasOwnProperty("rain")) {
                $("#" + i + " .precipitation .val").text(data.list[i].rain["3h"]);

            }
            else{
                $("#" + i + " .precipitation .val").text("Pas de données");
            }
        }
        



    });
}
//afficher Météo pour default ville
//if (JSON.parse(localStorage.getItem("villeId")) >= 100) {
if (localStorage.getItem("villeId")) {    
    let villeId = JSON.parse(localStorage.getItem("villeId"));
    let listeVille = JSON.parse(localStorage.getItem("listeVille"));
    let celsius = JSON.parse(localStorage.getItem("celsius"));
    showWeather(listeVille[villeId].coord.lat, listeVille[villeId].coord.lon, celsius);
    $("#villeInfo").text(listeVille[villeId].name);
    //console.log(listeVille[villeId].name);
    //location.reload();
} else {
    showWeather(MONTREAL.lat, MONTREAL.lon, true);
    $("#villeInfo").text("Montreal");

}
//showWeather(MONTREAL.lat, MONTREAL.lon, true);
  //  $("#villeInfo").text("Montreal");

$("#location").click(function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(useCurrentLocation);
    }
    else{
        $("#err").text("Geolocation is not supported by this browser");
    }
});
function useCurrentLocation(postion){
    let celsius="";
    if(localStorage.getItem("celsius")){
        celsius = localStorage.getItem("celsius");
    }
    else{
        celsius = "true";
    }
    
    showWeather(postion.coords.latitude,postion.coords.longitude, celsius);
}