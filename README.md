# Miyagami Assignment - Display images from Flickr API

## Project Description

An application that queries the Flickr API based on keywords and displays the 
images on the users screen. The user can press an image and then some more details 
about that post appear, sort-of like instagram does it. The application has a responsive
layout, but works best on screens bigger or equal to tablets. The application follows this
[Figma File](https://www.figma.com/file/QqVT3CO0hfbTVkiagIOYzc/Miyagami-Case-App?node-id=102%3A24&t=4RZ7nXcWOiyVL7CY-0)

### !!!!!  Important
```
    When sending a query with no keywords, the application retrieves the most recent posts by design choice.
    For some reason, Flickr does not activate safe search for querying the most recent posts.
    So far I have not found a way to activate safesearch for this query
    
    Use this with causion because some restricted content, or content that is wrongfully tagged as safe may appear on your page
```

### Technologies
Even though a backed is not necessary on this sort of application, as the Flickr API can be queried
directly from the front-end, having a server using Node.js was a requirement on the assignment.
Front-end uses ReactJs to display the User Interface and the user interactions.

### Challenges and points of improvement
- The card that appears on the screen is not as responsive as I wished to be (on mobile it does not 
work as intended). For this, I think some media query would have been necessary to display the card
in a different way based on the user's machine.
- Infinite scroll proved to require some code refactoring. Due to the limited time I decided, instead of 
querying different pages using the scroll, to have 2 buttons to access the next and previous pages
- Displaying comments was a Could have from the beginning. Although, it is not a hard feature to implement,
due to the lack of time I decided to not tackle it in the end.

## How to Install and Run the Project

0. Clone the repository


1. Install Dependencies
```
cd client
npm install

cd server
npm install
```

2. Create an .env file using the .env.example.
```
Choose a port to run the server on and paste your Flickr Api key.
A key is required to be able to do more advanced queries,
and most importantly to have safe search enabled
```



3. Run Server
```
cd server
node app.js
```


4. Run Client
```
cd client
npm start
```

## Tests

The application has a few test to verify the correct behaviour when adding new features or when refactoring code.
These can be run using the following command
```
cd client
npm test

cd server
npm test
```

## How to use the project

When accessing the page, there is a search box where users can type keywords(tags) to query the flickr API.
If users want to query for multiple tags, they can separate them using a coma (e.g. "bus, train", if you type "bus train" it will consider it as one keyword)

Users can submit their query by either pressing enter, or by pressing the button to the left of the search box.
After submitting the query, a list of images appears on the user screen.

On the bottom right of the page there are two buttons which can be used to navigate through the pages. Users can click on any page
and a pop-up card will appear where more information about the image is displayed. This information includes:
- The picture
- The profile picture of the user that posted the image
- The username of the user
- The description of the picture if it exists
- The date when the picture was taken

If users click outside the pop-up card, it closes it. They can, then, select a different image.