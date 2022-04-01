The goal for the Sprint 3 was to develop and integrate frontend and backend, write unit test cases for both, and integration tests in cypress. Functionally, our goal was to make Create Posts and View posts by others work.

# Accomplishments

## Planning
- Sprint 3 board created [here](https://github.com/haxxorsid/referralboard/projects/5).

## Development

### Create Post :
	Back-End :
	1) Create route for creating post (adding a record in Post table)
	3) Added foreign key relationship for Post with Company, User
	4) Allow API access for logged in users only.
 
	Front-End :
	1) Add input fields for creating post
    2) Add URL validation rule for Resume link, Job link.
	2) Create Post page accessible only when not logged in.

### View posts by others :

	Back-End :
	1) Fetch posts by others based on current logged in user's company.
	2) Return no posts if CompanyId is not set.

	Front-End : 
	1) Fetch data from backend
    2) Show card for each post fetched. 

Read more about frontend in [Front-end wiki](https://github.com/haxxorsid/referralboard/wiki/Frontend-Documentation).

Read more about backend in [API wiki](https://github.com/haxxorsid/referralboard/wiki/API-Reference).

Read more about them here in [Database wiki](https://github.com/haxxorsid/referralboard/wiki/Database-Schema).

## Testing
Added unit test cases and integration test cases.
Read more about testing in [Testing wiki](https://github.com/haxxorsid/referralboard/wiki/Testing).

## Documentation

- [About the project](https://github.com/haxxorsid/referralboard/wiki)
- [Setup project](https://github.com/haxxorsid/referralboard/wiki/Setup)
- [Sprint Planning](https://github.com/haxxorsid/referralboard/wiki/Sprint-planning)
- [Testing](https://github.com/haxxorsid/referralboard/wiki/Testing)
- [Database Schema](https://github.com/haxxorsid/referralboard/wiki/Database-Schema)
- [API Reference](https://github.com/haxxorsid/referralboard/wiki/API-Reference)
- [Front-end Documentation](https://github.com/haxxorsid/referralboard/wiki/Frontend-Documentation)
- [Git Branching Strategy](https://github.com/haxxorsid/referralboard/wiki/Branching-Strategy)

## Demo Videos

- [Front-End]()
- [Back-End]()
