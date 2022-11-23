import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';

const URL = 'http://localhost:2000/api/images'

test('initial render should display title, form and textException', () => {
  // Arrange
  const container = render(<App />);

  // Act - find the elements displayed initially
  const textException = screen.getByText("Make your search");
  const form = screen.queryByPlaceholderText("Search for your favourite posts")
  const button = screen.getByRole('button', {})
  const title = screen.getByText("Search")

  // Assert
  expect(title).toBeInTheDocument();
  expect(textException).toBeInTheDocument();
  expect(form).toBeInTheDocument();
  expect(button).toBeInTheDocument()
});

test('add text to form should change the form displayed value', () => {
  // Arrange
  const container = render(<App />)

  // Act - trigger the change event
  const form = screen.queryByPlaceholderText("Search for your favourite posts")
  fireEvent.change(form, {target: {value: 'dog'}})

  // Assert - test for the change
  expect(form).toHaveValue('dog')
})

test('submit event should make a query to the server', async () => {
    // Arrange
    const container = render(<App />)
    // Mocked result needs to have the same structure as the application expects
    const mockedResults = {
        photos: {
            photo: [
        {
            "id": "52516711928",
            "owner": "130281204@N06",
            "secret": "dfde9a9633",
            "server": "65535",
            "farm": 66,
            "title": "Kahn & a tall Red Beardie Orchid",
            "ispublic": 1,
            "isfriend": 0,
            "isfamily": 0
        },
        {
            "id": "52516057296",
            "owner": "196579983@N04",
            "secret": "53bbc5d7f3",
            "server": "65535",
            "farm": 66,
            "title": "Curious Scarlett",
            "ispublic": 1,
            "isfriend": 0,
            "isfamily": 0
        },
    ]}}
    // Mock the fetch to return our own values
    jest.spyOn(global, 'fetch')
        .mockResolvedValue(Promise.resolve(
            {
        ok: true,
        status: 200,
        json: async () => mockedResults,
    }
    ))

    // Act - fire the submit event and wait for the changes to be displayed
    // For this waitForElementToBeRemoved is used which waits for the "Make your search" element to disappear
    const textException = screen.getByText("Make your search")
    const form = screen.queryByPlaceholderText("Search for your favourite posts")
    fireEvent.change(form, {target: {value: 'dog'}})
    fireEvent.submit(form)
    await waitForElementToBeRemoved(() => screen.getByText("Make your search"))
    const images = screen.getAllByRole("img")

    // Assert - the number of images and their src property and the mock call to the server
    expect(form).toHaveValue('dog')
    expect(images).toHaveLength(2)
    const mockedImages = mockedResults.photos.photo
    expect(images[0].src)
        .toEqual(`https://live.staticflickr.com/${
            mockedImages[0].server}/${mockedImages[0].id}_${mockedImages[0].secret}_w.jpg`)
    expect(images[1].src)
        .toEqual(`https://live.staticflickr.com/${
            mockedImages[1].server}/${mockedImages[1].id}_${mockedImages[1].secret}_w.jpg`)
    expect(fetch).toHaveBeenCalledWith(`${URL}?page=1&keywords=dog`)
    expect(textException).not.toBeInTheDocument()
})

test("submit event that does return an empty string should print no results found", async () => {
    // Arrange
    const container = render(<App />)
    const mockedResults = {
        photos: {
            photo: []
        }}
    // Mock the fetch to return empty array
    jest.spyOn(global, 'fetch')
        .mockResolvedValue(Promise.resolve(
            {
                ok: true,
                status: 200,
                json: async () => mockedResults,
            }
        ))

    // Act - fire the submit event and wait for the changes to be displayed
    // For this waitForElementToBeRemoved is used which waits for the "Make your search" element to disappear
    const form = screen.queryByPlaceholderText("Search for your favourite posts")
    fireEvent.change(form, {target: {value: 'dog'}})
    fireEvent.submit(form)
    await waitForElementToBeRemoved(() => screen.getByText("Make your search"))

    // Assert - the mocked call to the server and the No results element
    expect(form).toHaveValue('dog')
    expect(fetch).toHaveBeenCalledWith(`${URL}?page=1&keywords=dog`)
    expect(screen.getByText('No results found for "dog"')).toBeInTheDocument()
})


test("post appears when clicking an image and disappears on outside click of the post", async () => {
    // Arrange
    const container = render(<App />)
    // Mocked result needs to have the same structure as the application expects
    const mockedResults = {
        photos: {
            photo: [
                {
                    "id": "52516711928",
                    "owner": "130281204@N06",
                    "secret": "dfde9a9633",
                    "server": "65535",
                    "farm": 66,
                    "title": "Kahn & a tall Red Beardie Orchid",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                }
            ]}}
    // Mock the fetch to return our own values
    jest.spyOn(global, 'fetch')
        .mockResolvedValue(Promise.resolve(
            {
                ok: true,
                status: 200,
                json: async () => mockedResults,
            }
        ))

    // Act - fire the submit event and wait for the changes to be displayed
    // For this waitForElementToBeRemoved is used which waits for the "Make your search" element to disappear
    const form = screen.queryByPlaceholderText("Search for your favourite posts")
    fireEvent.change(form, {target: {value: 'dog'}})
    fireEvent.submit(form)
    await waitForElementToBeRemoved(() => screen.getByText("Make your search"))
    const image = screen.getAllByRole("img")[0]
    // Fire click event on the image
    fireEvent.click(image)
    const postWrapper = screen.getByTestId("post-element")

    //Assert - Expect the appearance of the post in the document
    expect(postWrapper).toBeInTheDocument()

    //Act - Fire click event on the outside of the post
    fireEvent.click(postWrapper)

    // Assert - Expect the disappearance of the post in the document
    expect(postWrapper).not.toBeInTheDocument()
})