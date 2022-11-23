import { render, screen, waitFor} from '@testing-library/react';
import Post from '../components/Post/Post'

const URL = 'http://localhost:2000/api/images'

test("correct mount of the post", async () => {
    //Arrange
    // Props sent on render
    const image = {
        id: "52517449831",
        server: "65535",
        secret: "c25202bdab"
    }
    //Mocked return value of the api call
    const mockedInfo = {
        photo: {
            owner: {
                iconFarm: 6,
                iconServer: "5337",
                nsid: "47614656@N05",
                username: "PattyK.",
            },
            dates: {
                taken: "2022-11-16 10:55:18"
            },
            description: {
                _content: "Ioannina, Greece - November 2022"
            }
        }
    }
    // Mock the fetch to return our own values
    jest.spyOn(global, 'fetch')
        .mockResolvedValue(Promise.resolve(
            {
                ok: true,
                status: 200,
                json: async () => mockedInfo,
            }
        ))

    // Act - render the component and wait for the fetch to finish
    const container = render(<Post image={image} />)
    await waitFor(() => expect(screen.queryByText("Ioannina, Greece - November 2022")).toBeInTheDocument())

    // Assert that all the elements of the post are there and that the server call was correct
    expect(screen.queryByText("PattyK.")).toBeInTheDocument()
    expect(screen.queryByText("16 November 2022, 10:55")).toBeInTheDocument()
    expect(screen.getAllByRole("img")).toHaveLength(2)
    expect(fetch).toHaveBeenCalledWith(`${URL}/${image.id}`)
})
