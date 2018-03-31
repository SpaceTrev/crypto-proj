var config = {
    apiKey: "AIzaSyD4WpXJE_OjEOIdB9pHDMGofStkUiENuGk",
    authDomain: "cryptoproject-e243e.firebaseapp.com",
    databaseURL: "https://cryptoproject-e243e.firebaseio.com",
    projectId: "cryptoproject-e243e",
    storageBucket: "cryptoproject-e243e.appspot.com",
    messagingSenderId: "754040931090"
};

firebase.initializeApp(config);
var database = firebase.database();

const txtEmail = document.getElementById("user");
const txtPassword = document.getElementById("pass");
const btnLogin = document.getElementById("login");
const btnSignUp = document.getElementById('signup');
const btnSignOut = document.getElementById('logout');

btnLogin.addEventListener('click', e => {
    e.preventDefault();
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

});
btnSignUp.addEventListener('click', e => {
    e.preventDefault();
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        .catch(e => console.log(e.message));
});
btnSignOut.addEventListener('click', e => {
    firebase.auth().signOut();
})
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        btnSignOut.classList.remove('invisible');
        // window.location = 'index.html';
        $("#loggedin").removeClass("d-none")
        $("#loggedout").empty();
    } else {
        console.log("not logged in");
    }
});

btnSignOut.addEventListener('click', e => {
    firebase.auth().signOut(); {
        window.location = 'index.html';
    }
});

var coinButtonArray = ["BTC", "LTC", "ETH", "XRP", "XLM", "XRB", "NEO", "BCH"];

function createButtons() {

    $("#coinPrice").empty();
    $("#cryptoSpace").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinButtonArray[i] + "&tsyms=USD,EUR";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (data) {
                for (var name in data.DISPLAY) {
                    // console.log(data)
                    var colorPrice;
                    var textColor;
                    var marketCap = data.DISPLAY[name].USD.MKTCAP;
                    var coinPrice = roundToTwo(data.RAW[name].USD.PRICE);
                    var nameId = name;
                    var chart = chartGeneration(nameId);
                    var priceChangePct = data.DISPLAY[name].USD.CHANGEPCT24HOUR;
                    var priceChange = data.DISPLAY[name].USD.CHANGEPCTDAY;
                    // console.log(data.DISPLAY[name]);
                    var showBtn;
                    // console.log(cryptos);
                    if (checkIfinPortfolio(nameId)) {
                        showBtn = `<button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio" data-name='${nameId}'>In Portfolio</button>`
                    } else {
                        showBtn = `<button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio" data-name='${nameId}'>Add to Portfolio</button>`
                    }
                    // console.log(marketCap);
                    // console.log(coinPrice);
                    // console.log(priceChange);
                    if (priceChangePct < 0) {
                        colorPrice = "redPrice";
                        textColor = "redColor";
                    } else {
                        colorPrice = "greenPrice";
                        textColor = "greenColor";
                    }
                    $("#cryptoSpace").append(`

                     <div class="col-md-6 col-lg-3">
                        <div class="card">
                        <div class="ct-chart" id="${nameId}"></div>
                        <div class="card-body">
                        <h5 class="card-title">${nameId}</h5>
                        <p class="card-text">Price: ${coinPrice}$</p>
                        <p class="card-text">MarketCap: ${marketCap}$</p>
                        <p class="card-text">24hr change:<span class="${colorPrice}"> ${priceChangePct}% </span>  <span class="${textColor}">${priceChange}$</span></p>
                        
                        ${showBtn}
                    </div>
                </div>
            </div>
        `)
                }
            });
    }
}
function chartGeneration(name) {
    var chartQueryURL = "https://min-api.cryptocompare.com/data/histoday?fsym=" + name + "&tsym=USD&limit=10&aggregate=3&e=CCCAGG";
    var timeses;
    $.ajax({
        url: chartQueryURL,
        method: "GET"
    }).then(function (data) {
        var dateString = moment(timeConvert)._d;
        var iterationObject = Object.keys(data.Data)
        var time = data.Data[0].time;
        var timeConvert = time.toString();
        // console.log(data.Data);
        for (var i = 0; i < iterationObject.length; i++) {
            timeses = data.Data[i].time;
            var convertedAf = moment.unix(timeses)._d;
            var highPrices = data.Data[i].high;
            var closePrices = data.Data[i].close;
            var lowPrices = data.Data[i].low;
            var volumeFrom = data.Data[i].volumefrom;
            var volumeTo = data.Data[i].volumeto;
            console.log(highPrices, "highPrices");
            console.log(lowPrices, "lowPrices");
            console.log(closePrices, "closePrices");
            console.log(volumeFrom, "volumeFrom");
            console.log(volumeTo, "volumeTo");
            console.log(convertedAf, "times");
        }
        var chartData = {
            // A labels array that can contain any sort of values
            labels: [],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [data.Data[0].high, data.Data[1].high, data.Data[2].high,
                data.Data[3].high, data.Data[4].high, data.Data[5].high,
                data.Data[6].high, data.Data[7].high, data.Data[8].high,
                data.Data[9].high, data.Data[10].high]
            ],
            height: 150,
            width: 215

        };
        var removeLabels = {

            showLabel: false,
            axisX: {
                showLabel: false,
                showGrid: false,

            },
            axisY: {
                showLabel: false,
                showGrid: false,

            },
            height: 150,
            width: 215,
        }

        // Create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. The Second parameter
        // is the actual data object.
        return new Chartist.Line(`#${name}`, chartData, removeLabels);
        // console.log(removeLabels);
    })
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function createSavedButtons(name) {

    var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + name + "&tsyms=USD,EUR";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (data) {
            var colorPrice;
            var textColor;
            var marketCap = data.DISPLAY[name].USD.MKTCAP;
            var coinPrice = data.DISPLAY[name].USD.PRICE;
            var nameId = name;
            var priceChangePct = data.DISPLAY[name].USD.CHANGEPCT24HOUR;
            var priceChange = data.DISPLAY[name].USD.CHANGE24HOUR;
            if (priceChangePct < 0) {
                colorPrice = "redPrice";
                textColor = "redColor";
            } else {
                colorPrice = "greenPrice"
                textColor = "greenColor";
            }
            $("tbody").append(`
                <tr>
                   <th scope="row">${nameId}</th>
                   <td>${coinPrice}</td>
                   <td>${marketCap}</td>
                   <td class='${nameId}'><input type='number' id="${nameId}"> <button id=${nameId} type='submit' class='btn btn-success'>Submit</button></input></td>
                   <td class='value'></td>
                   <td><span class="${colorPrice}">${priceChangePct}%</span> <span class="${textColor}">${priceChange}$</span></td>
               </tr>
       
       `);
            $(document).on(`click`, `.btn-success`, function (event) {
                event.preventDefault();
                var ammountInput = $(`#${nameId}`).val();
                var removedDollarSign = coinPrice.replace(/\$/g, '');
                // console.log(removedDollarSign);
                if (ammountInput) {
                    $(`.${nameId}`).html(ammountInput);
                    // console.log(ammountInput);
                    var value = removedDollarSign * ammountInput;
                    // console.log(coinPrice);
                    // console.log(value);
                    $(".value").html(value);
                }

            })

        })
}

var nameArray = [];
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('value', function (snapshot) {
            var cryptos = snapshot.val();
            for (var key in cryptos) {
                var crypto = cryptos[key];
                nameArray.push(crypto.name);
            }
            createButtons();
        });
    } else {
        createButtons();
    }
})




function checkIfinPortfolio(name) {
    return nameArray.includes(name);
}

function cryptoInPortfolio() {
    return nameArray;
}


function coinToPortfolio(name) {
    $(this).text("In Portfolio");
    var coinName = $(this).attr("data-name");
    var nameArray = [];
    // console.log(firebase.auth().currentUser.uid);
    database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).on('child_added', function (snapshot) {
        // console.log(snapshot.val().name);
        nameArray.push(snapshot.val().name);

    });
    if (nameArray.indexOf(coinName) < 0) {
        database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).push({
            name: coinName
        })
    }
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('child_added', function (snapshot) {
            // console.log(snapshot.val().name);
            createSavedButtons(snapshot.val().name);

        });
    }
});

$(document).on("click", "#addPortfolio", coinToPortfolio);