var lcboAPP = {};

lcboAPP.apiUrl = 'http://lcboapi.com/products';

lcboAPP.init = function() {
    lcboAPP.wines();
    cheeseBoard.getCheeses();
    lcboAPP.quizProgression();
};

lcboAPP.quizProgression = function() {
    $('input:radio[name=wine-choices]').click(function() {
            if ($('input[name=wine-choices]:checked').val() === 'white wine') {
                $('.flavor-white').css("display","block");
                $('.flavor-red').css("display","none");
            }
            else if ($('input[name="wine-choices"]:checked').val() === 'red wine') {
                $('.flavor-red').css("display","block");
                $('.flavor-white').css("display","none");
            }
        });

    $('input:radio[name=flavor-choices]').click(function() {
                $('#price-selection').css("display","block");
        });
};




lcboAPP.wines = function(){ 
    $.ajax({
        url: lcboAPP.apiUrl,
        method: 'GET',
        dataType: 'jsonp',
        headers: {
            'Authorization': 'Token MDoxYTE4NTgyYy0xYzZkLTExZTYtYmJhMy1mNzY5YTAxY2E1ZjY6dVloUEFmY1pBenQxeGZ0R3pGd1pLTjkxVm93am5za3NMR01O'},
        data: {
            q:'wine',
            // page: 8,
            per_page: 100
        }
    }).then(function(data){
        // console.log(data); // this should display 100 'wine' results, unfiltered.

        //prevent the default submit event! (ie. cancel page refresh)

        $('form').on('submit', function(e) {
            e.preventDefault();
            $('.cheeses').css("display", "flex");

            $('.wine').html('');
            $('.hard ul').html('');
            $('.soft ul').html('');
            $('.blue ul').html('');
            $('.goat ul').html('');
            $('.wash-rind ul').html('');

            // Create variables to hold the user choices from the HTML inputs
            var userSubmission = {}

            userSubmission.wine = $('input[name=wine-choices]:checked').val();

            userSubmission.flavor = $('input[name=flavor-choices]:checked').val();

            userSubmission.price = $('input[name=price-range]').val();

            userSubmission.price = (userSubmission.price)*100;

            // use the userSubmission to filter the data (ie. white wines, fruit, no more than 90$)

            var wine = data.result.filter(function(value){
                return value.secondary_category.toLowerCase() === userSubmission.wine.toLowerCase();
            });
            
            wine = wine.filter(function(value){
                return value.style.toLowerCase() === userSubmission.flavor.toLowerCase();
            });

            wine = wine.filter(function(value){
                return value.regular_price_in_cents <= userSubmission.price;
            });

            var length = wine.length;
            var random = Math.floor((Math.random() * length)); 
            var randomWine = wine[random];

            // // push data to DOM

            // /////////// LET'S TRY THIS TEMPLATE AWESOMENESS!!!

            var myTemplate = $('#myWineTemplate').html();
            var template = Handlebars.compile(myTemplate);
            var wineInfoToDisplay = {
                name: randomWine.name,
                price: randomWine.regular_price_in_cents/100,
                description: randomWine.package,
                photo: randomWine.image_url,
                varietal: randomWine.varietal,
                alcohol: randomWine.alcohol_content,
                region: randomWine.origin,
                producer: randomWine.producer_name,
                sugar: randomWine.sugar_in_grams_per_liter,
                sweetness: randomWine.sugar_content,
                style: randomWine.style,
                tasting_note: randomWine.tasting_note
            }

            var filledTemplate = template(wineInfoToDisplay);

            $('.wine').append(filledTemplate);

            // //////////////////////////////



            lcboAPP.display(wine,userSubmission);


        }); //$('form').on('submit');
    }); //then.function();
}; //lcboAPP.wines();

lcboAPP.display = function(wine,userSubmission){    
    // This array holds all the filtered cheeses
    var masterCheesePairings = [];

    // Use the 'userSubmission' to determine which .cheeseObjects will be curated
        if (userSubmission.wine === 'white wine'){

            var filteredCheese = function(){
                
                for (var i = 0; i < lcboAPP.cheeseObjects.length ; i++) {

                    // we use .indexOf to find if a string exists within another string.
                    var str = lcboAPP.cheeseObjects[i].wine_white;
                    var result = str.indexOf(userSubmission.flavor.toLowerCase()) > -1;
                    // if result = true push to the master list.
                    if (result === true){
                    masterCheesePairings.push(lcboAPP.cheeseObjects[i]);
                    };
                };
                    // console.log(masterCheesePairings);
                    for (var j = 0; j < masterCheesePairings.length ; j++) {
                        // console.log(masterCheesePairings[j]);
                    if(masterCheesePairings[j].category === 'hard'){
                      
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.hard ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'soft'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.soft ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'blue'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.blue ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'goat_sheep'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.goat ul').append(filledTemplate);

                    }else if(masterCheesePairings[j].category === 'washed_rind'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.washed-rind ul').append(filledTemplate);
                    };
                };
            };
            filteredCheese();
        } else {
            var filteredCheese = function(){
                
                for (var i = 0; i < lcboAPP.cheeseObjects.length ; i++) {

                    // we use .indexOf to find if a string exists within another string.
                    var str = lcboAPP.cheeseObjects[i].wine_red;
                    var result = str.indexOf(userSubmission.flavor.toLowerCase()) > -1;
                    // if result = true push to the master list.
                    if (result === true){
                    masterCheesePairings.push(lcboAPP.cheeseObjects[i]);
                    };
                };
                    // console.log(masterCheesePairings);
                    for (var j = 0; j < masterCheesePairings.length ; j++) {
                        // console.log(masterCheesePairings[j]);
                    if(masterCheesePairings[j].category === 'hard'){
                      
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.hard ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'soft'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.soft ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'blue'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.blue ul').append(filledTemplate);

                    }if(masterCheesePairings[j].category === 'goat_sheep'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.goat ul').append(filledTemplate);

                    }else if(masterCheesePairings[j].category === 'washed_rind'){
                        var myTemplate = $('#myCheeseTemplate').html();
                        var template = Handlebars.compile(myTemplate);
                        var cheeseInfoToDisplay = {
                            name: masterCheesePairings[j].cheese,
                            description: masterCheesePairings[j].description,
                            photo: masterCheesePairings[j].img_src
                        }
                        var filledTemplate = template(cheeseInfoToDisplay);
                        $('.washed-rind ul').append(filledTemplate);
                    };
                };
            };
            filteredCheese();
        };
};
    
var cheeseBoard = {};
cheeseBoard.apiUrl = 'https://sheetsu.com/apis/v1.0/042c409bd2cc';

cheeseBoard.getCheeses = function(){ 
    $.ajax({
        url: cheeseBoard.apiUrl,
        method: 'GET',
        dataType: 'json'
    })
    .then(function(data){
        lcboAPP.cheeseObjects = data;
    });
};


$(document).ready(function(){
    lcboAPP.init();
});



















