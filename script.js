const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
const apiKey = "8RPxwu3I3ehlJRmfvzbjAlY56LZidYVBoTQErAWMzxE";
let count = 5;
const unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function updateAPIurl(num){
    unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${num}`;
}

// Check if all images were loaded
function imageLoaded(){
    imagesLoaded++;
    if (imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
        count = 30;
    }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

// Create elements for links and photos and add to DOM.
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        // create <a> to link to unsplash
        const item = document.createElement('a');

        setAttributes(item, {
            href: photo.links.html,
            target: "_blank"
        });

        // Create <img> for photo
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // Event listener, check when each is loaded
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Get Photos from unsplash api
async function getPhotos() {
    try {
        const response = await fetch(unsplashApi);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad){
            updateAPIurl(30);
            isInitialLoad = false;
        }
    } catch (error) {
        console.log(error);
    }
}

// Check to see if scrolling near bottom of page then load more photos
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight - 100 && ready){
        ready = false;
        getPhotos();
    }
})

// On Load
getPhotos();