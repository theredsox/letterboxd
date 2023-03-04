const main = () => {
    // Extension features that only are active within the context of a member
    const member = document.body.getAttribute('data-owner');
    if (member) {
        memberFilmActivity(member);
    }
}

const memberFilmActivity = (member) => {
    // Find film posters
    const filmPosters = document.querySelectorAll("div.film-poster[data-film-link]");
    for (const filmPoster of filmPosters) {
        // Attach a listener to customize film poster menus.
        // NOTE: Menus are only added to the DOM onmouseover.
        filmPoster.addEventListener('mouseover', function(e) {
            const id = filmPoster.getAttribute('data-film-id');
            const link = filmPoster.getAttribute('data-film-link');
            customizeFilmPosterMenu(member, id, link); 
        }, {once : true});
    }
}

const customizeFilmPosterMenu = (member, filmId, filmLink) => {
    // Find film menus where a user activity option hasn't been added yet
    const filmMenus = [...document.querySelectorAll(".popup-menu.film-menu > ul:not([user-activity-added])")];

    // Filter down to UL's with the passed film id
    const idSelector = "a[data-film-id='" + filmId + "']";
    const filmMenusForId = filmMenus.filter(ul => ul.querySelector(idSelector));

    for (const filmMenu of filmMenusForId) {
        addCurrentUserActivityToList(member, filmLink, filmMenu);
    }
}

// Function to add an option to the passed menu to show a member's activity of a film.
const addCurrentUserActivityToList = (member, filmLink, filmMenu) => {
    const url = 'https://letterboxd.com/' + member + filmLink + 'activity/';
    var a = document.createElement('a');
    a.onclick = () => {
        // The redirect is slow, feels more responsive to close the menu 
        // immediately onclick while waiting for the redirect
        filmMenu.parentElement.style.display = 'none';
        window.location.href = url;
    };
    a.appendChild(document.createTextNode('User Activity'));
    var li = document.createElement('li');
    li.classList.add('popup-menu-text')
    li.style.cursor = 'pointer';
    li.appendChild(a);
    filmMenu.appendChild(li);

    // Used to mark a film menu as 'done' to avoid any chance of adding duplicates
    filmMenu.setAttribute('user-activity-added', 'true')
}

// onload was inconsistently firing too early to find the film posters.
// Tried alternatives specific to Chrome extensions, but didn't help.
// TODO: Revisit later
window.addEventListener("load", () => { setTimeout(main, 100) });