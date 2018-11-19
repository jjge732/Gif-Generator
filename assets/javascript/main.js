let topics = ['Titanic', 'Avatar', 'Tomb Raider', 'Avengers', 'Spiderman'];


const gifMaker = newGif => {
    let newSpan = $(`<span class="gifRetriever" id='${newGif}'>`).html(newGif);
    $('body').prepend(newSpan);
}

for (let i = 0; i < topics.length; i++) {
    gifMaker(topics[i]);
}

$(document).on('click', '.gifRetriever', function() {
    $.ajax({
        url: `http://api.giphy.com/v1/gifs/search?q=${$(this).attr('id')}&api_key=lAhHEl8an6xkWeYnc4E6FJW90Dr9e79m&limit=10&rating=pg-13`
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.data.length; i++) {
            let gif = $(`<img src='${response.data[i].images.fixed_height_still.url}'>`)
            $('#gifHolder').prepend($('<p>').html(`Gif Rating: ${response.data[i].rating}<img class="likeBtn" alt="like button" data-starStatus="notStared" data-unstar="assets/images/iconfinder_star_172558.png" data-star="assets/images/iconfinder_star_299040.png" src="assets/images/iconfinder_star_172558.png">`));
            $('#gifHolder').prepend(gif);
            gif.attr('class', 'toggleAnimation')
            gif.attr('data-animated', response.data[i].images.fixed_height.url);
            gif.attr('data-still', response.data[i].images.fixed_height_still.url);
            gif.attr('data-likeStatus', 'still');
        }
    })
})

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

$(document).on('click', '#searchBtn', function() {
    let newSearch = $('#searchBar').val();
    topics.push(newSearch);
    gifMaker(newSearch);
})

$(document).on('click', '.likeBtn', function() {
    if ($(this).attr('data-starStatus') === 'notStared') {
        $(this).attr('src', $(this).attr('data-star'));
        $(this).attr('data-starStatus', 'stared');
        $(this).prepend('#starredGifs');
    }
    else if ($(this).attr('data-starStatus') === 'stared') {
        $(this).attr('src', $(this).attr('data-unstar'));
        $(this).attr('data-starStatus', 'notStared');
        $(this).prepend('gifHolder')
    }
})