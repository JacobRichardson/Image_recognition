
//Inialize clarifai with the api key.
const app = new Clarifai.App({
    apiKey: config.clarifaiApiKey
});

//Document on ready function.
$(function() {
    
    //Add an click event listener to the button.
    $("#button").click( () => {
        //Call pictureRecoginition.
        pictureRecoginition()
    });
    
    /**
     * @description This function grabs a url from the user, passes it to clarifai for image recogniton, and writes the output to page.
     **/
    function pictureRecoginition () {

        //Get the url.
        let url = $("#url").val();
        
        //If the user didn't type a url.
        if (url =="") {
            
            //Set it to a deafult.
            url = "https://samples.clarifai.com/metro-north.jpg";
        }
        
        //jQuery objects.
        let $img = $("#img");
        let $concepts = $("#concepts");
        let $heading = $("#right-heading");
        
        //Clear concepts of any html
        $concepts.html("");
        
        //Calling clarifai with the general model.
        app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
            .then(generalModel => {
                
                //Return a promise of predicting the url.
                return generalModel.predict(url);
            })
            .then(response => {
                
                //Concepts are what the model predicted the image contains or is about.
                let concepts = response['outputs'][0]['data']['concepts'];
                
                //For each loop on the concepts.
                concepts.forEach( concept => {
                    
                    //Converting the number to a string.
                    let niceValue = '' + concept.value;
                    
                    //Grabbing the first two digits of the percet, adding a period grabbing the first two digits after the decimmal, and adding a percent sign.
                    niceValue = niceValue.slice(2,4) + "." + niceValue.slice(4,6) + "%";
                    
                    //Appending html to concepts.
                    $concepts.append("<p><em class='description'>" + concept.name + "</em> - " + niceValue + "</p>"); 
                });
                
                //Set the img src to the url that was provided.
                $img.attr("src", url);
                
                //Make the image visibile.
                $img.css("display", "block");
                
                //Make the heading visible.
                $heading.css("display", "block");
                
                //Add text-decoration-color light blue to all descriptions because it wasn't working in the css file.
                $('.description').css("text-decoration-color", "#28ADD6");
                
            });
    }
});    
  