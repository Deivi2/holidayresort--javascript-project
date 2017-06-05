"use strict";

var resortController = (function () {


});


var getJson = (function () {
    var resorts;

    return {
        getResorts: function () {
            $.ajax({
                type: "GET",
                url: "/resorts",
                dataType: 'json'
            }).done(function (data) {
                JSON.stringify(data);
                resorts = data;
            });
        },

        returnResorts: function () {
            return resorts.resorts;
        }
    }
})();


var UIcontroller = (function () {

    //  var options;

    return {
        resortView: function (obj, locationInput, nameInput, stars) {
            var resortHTML, newResort, id, name, confLevel, location;

            id = obj.id;
            name = obj.name;
            confLevel = obj.comfortLevel;
            location = obj.location;

            console.log(id);


            resortHTML = '<div id="res-holder-id" class="res-holder" id="%resortId%">' +
                '<img class="pic" src="images/' + id + 'pic1small.png">' +
                '<div class="resort-name">%name%</div> ' +
                '<div class="resort-comfort">%comfort%</div>' +
                '<div class="resort-info">%descritpion%</div>' +
                '<a href=%url%>link text</a>' +
                '</div>';

            newResort = resortHTML.replace('%resortId%', obj.id);
            newResort = newResort.replace('%name%', obj.name);
            newResort = newResort.replace('%comfort%', obj.comfortLevel);
            newResort = newResort.replace('%descritpion%', obj.short_description);
            newResort = newResort.replace('%url%', obj.url);


            //get resorts that satisfy input info if input on empty
            if (name.indexOf(nameInput) > -1 && locationInput !== "" && stars === confLevel && location === locationInput) {
                document.querySelector('.resorts-container').insertAdjacentHTML('beforeend', newResort);
            }else if(stars === 'all' && location === locationInput && name.indexOf(nameInput) > -1){
                document.querySelector('.resorts-container').insertAdjacentHTML('beforeend', newResort);
            }



            console.log(location)
        },
        resortsInputList: function (obj) {
            var newOptions, options;

            if (!options) {
                options = '<option value="%name%">';
                newOptions = options.replace('%name%', obj.name);
                document.querySelector('#resorts-input-list').insertAdjacentHTML('beforeend', newOptions)
            }
        },
        resortLocationList: function (obj) {
            var location, newLocation;

            location = '<option value="%loc%">';
            newLocation = location.replace('%loc%', obj.location);
            document.querySelector('#location-input-list').insertAdjacentHTML('beforeend', newLocation)
        },


        addInfoResorts: function () {
            var info, elements;

            elements = document.querySelector('.resorts-container').childElementCount;

            info = '<div class="info-label"><h3>' + elements + ' search result found </h3> </div>';

            document.querySelector('#resorts-info-id').insertAdjacentHTML('beforeend', info);

        },

        getResortSearch: function () {
            return {
                name: document.querySelector('.input-list').value,
                comfLevel: document.querySelector('.comfort_level_value').value,
                loc: document.querySelector('.input-list-location').value
            }
        },
        clearResorts: function () {

            //clear actual resort's
            var el = document.getElementById('resorts-container-id');
            el.innerHTML = '';

            //resort count info
            var resortInfo = document.getElementById('resorts-info-id');
            resortInfo.innerHTML = '';
        }
    }

})();


var controller = (function (UICntrl, DataCtrl, resCtrl) {


    var setController = function () {


        // fetch resorts from server to resorts variable in data controller
        DataCtrl.getResorts();

        //event listener on search button
        document.querySelector('.search').addEventListener('click', function () {
            findResorts();
            setResortsInformation();
        });
    };

    //get list of resort on input clicked
    var setOptionsList = function () {
        var resorts, r;
        resorts = DataCtrl.returnResorts();
        for (var i = 0; i < resorts.length; i++) {
            r = resorts[i];
            //set resort names list options
            UICntrl.resortsInputList(r);
            //set resort locations list options
            UICntrl.resortLocationList(r)
        }
    };

    //set all resorts
    var resorts, r, resortsFound;
    var setResorts = function (name, location) {
        var comfortLevel;

        //get comfort level
        comfortLevel = UICntrl.getResortSearch().comfLevel;


        //get resorts from data controller
        resorts = DataCtrl.returnResorts();


        //loop through all resorts
        for (var i = 0; i < resorts.length; i++) {
            r = resorts[i];

            //add resorts to UI
            UICntrl.resortView(r, location, name, comfortLevel);

            //get resorts found
            resortsFound = i;
        }
    };


    var findResorts = function () {
        var input, location;

        //get location
        location = UICntrl.getResortSearch().loc;

        //get resort name
        input = UICntrl.getResortSearch().name;

        //clear old resort if was
        if (resorts) {
            UICntrl.clearResorts();
        }

        //find resort by it name
        setResorts(input,location);
    };


    var setResortsInformation = function () {
        //show numbers of resorts found is UI
        UICntrl.addInfoResorts();

    };


    return {
        init: function () {
            setController();

        },
        priorityOptions: function () {
            setOptionsList()
        }
    }

})(UIcontroller, getJson, resortController);


controller.init();

