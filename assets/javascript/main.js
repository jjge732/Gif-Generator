let topics = ['Titanic', 'Avatar', 'Tomb Raider', 'Avengers', 'Spiderman', 'Iron Man'];
let starCount = 0;  //number to keep track of favorited gifs
let gifCount = 0;   //number to keep track of all gifs

//  creates new buttons that will get gifs when clicked
const gifButtonMaker = newGif => {
    let newSpan = $(`<span class="gifRetriever" id='${newGif}'>`).html(newGif);
    $('#nonstaredGifs').prepend(newSpan);
}

//  runs through the hard-coded gif topics to create buttons for them
for (let i = 0; i < topics.length; i++) {
    gifButtonMaker(topics[i]);
}

//uses the gif buttons to get gifs and give them attributes that allow for the ability to toggle between still and gif formats
$(document).on('click', '.gifRetriever', function() {
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${$(this).attr('id')}&api_key=lAhHEl8an6xkWeYnc4E6FJW90Dr9e79m&limit=10&rating=pg-13`
    }).then(function(response) {
        for (let i = 0; i < response.data.length; i++) {
            //gif box holds a gif as well as rating and star button corresponding to it
            let gifBox = $(`<span id='gif-${gifCount}'>`);
            //gif holder holds all the gifs
            $('#gifHolder').prepend($(gifBox));
            //sets the default image src to the still image
            let gif = $(`<img src='${response.data[i].images.fixed_width_still.url}'>`)
            $(gifBox).prepend($('<p>').html(`Gif Rating: ${response.data[i].rating.toUpperCase()}<img class="likeBtn" alt="like button" data-nbr='${gifCount}' data-starStatus="notStared" data-unstar="assets/images/iconfinder_star_172558.png" data-star="assets/images/iconfinder_star_299040.png" src="assets/images/iconfinder_star_172558.png">`));
            $(gifBox).prepend(gif);
            //creates attributes which allow for easy switching between data types
            gif.attr('class', 'toggleAnimation')
            gif.attr('data-animated', response.data[i].images.fixed_width.url);
            gif.attr('data-still', response.data[i].images.fixed_width_still.url);
            gif.attr('data-likeStatus', 'still');
            gifCount++;
        }
    })
})

// causes image to switch between still and gif
$(document).on('click', '.toggleAnimation', function() {
    if ($(this).attr('data-likeStatus') === 'still') {
        let animate = $(this).attr('data-animated');
        $(this).attr('src', animate);
        $(this).attr('data-likeStatus', 'animated')
    }
    else if ($(this).attr('data-likeStatus') === 'animated') {
        let stationary = $(this).attr('data-still');
        $(this).attr('src', stationary);
        $(this).attr('data-likeStatus', 'still')
    }
})

//adds search funcitonality, pushses the search into the topics array, and creates a new button for the search item
$(document).on('click', '#searchBtn', function() {
    let newSearch = $('#searchBar').val();
    topics.push(newSearch);
    gifButtonMaker(newSearch);
})

//adds 'like' functionality to the page
$(document).on('click', '.likeBtn', function() {
    if ($(this).attr('data-starStatus') === 'notStared') {
        let that = `#gif-${$(this).attr('data-nbr')}`;
        $(this).attr('src', $(this).attr('data-star'));
        $(this).attr('data-starStatus', 'stared');
        $('#staredGifs').append($(that));
        localStorage.setItem(`star-${starCount}`, that);
        starCount++;
    }
    else if ($(this).attr('data-starStatus') === 'stared') {
        let that = $(`#gif-${$(this).attr('data-nbr')}`);
        $(this).attr('src', $(this).attr('data-unstar'));
        $(this).attr('data-starStatus', 'notStared');
        $('#gifHolder').prepend(that);
        localStorage.setItem(`star-${starCount}`, '');
    }
})

//appends the favorites when document loads
for (let i = 0; i <= starCount; i++) {
    let toBeAppended = localStorage.getItem(`star-${i}`);
    $('#staredGifs').append($(toBeAppended));
    console.log(toBeAppended);
}