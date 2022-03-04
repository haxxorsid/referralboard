The goal for the Sprint 2 was to develop the integrate frontend and backend, write unit test cases for both, and integration tests in cypress. Functionally, our goal was to make Login, Register, Edit Profile, and Home (previous posts by a logged in user) work.


# Accomplishments

## Planning
- Sprint 2 board created [here](https://github.com/haxxorsid/referralboard/projects/4).

## Development

### Common :
	Back-End :
	1) Storage of resume as url.
	2) Password encoding
	3) Table Relations
		1) Link Company with Post.
		2) Fetch all posts of a user
	4) Allow some API access for logged in users only.
 
	Front-End :
	1) Edit profile and Home Page accessible only when logged in.
	2) Login and Register page accessible only when not logged in.

### Register :

	Back-End :
	1) Adding new user to DB
	2) User inputs Validation

	Front-End : 
	1) User Input Validation
	2) Send data to backend
	3) Show toast for success/error.
	4) Show labels like field is required, email is not a valid.

### Login :
	
	Back-End :
	1) Verify E-mail Id and Password
	2) User Input Validation
	3) Set JWT token in cookie.

	Front-End :
	1) Send User credentials to backend for validation
	2) Show toast for success/error.
	3) Show labels like field is required, email is not a valid.

### Edit Profile :
	
	Back-End : 
	1) Receive Existing Data
	2) Update user details
	3) Validate User
	4) Create separate APIs for updating profile, updating email (check if user already exists with the new email, update companyid and company name according the email provided), and updating password (check if current password is valid, only then reset password).
  
	Front-End :
	1) Fetch previous data and fill the form
	2) Send  data to backend
	3) Show labels like field is required, email is not a valid.
	4) Create separate  tabs for updating profile, updating email, and updating password (provide current and new password).

### Home Page :

	Back-End :
	1) Fetch user’s previous posts
	2) Delete Post
	
	Front-End :
	1) Show posts (one tab posts by the user logged in, and one tab posts by others users requesting for logged in user's organization)
	2) Show resume and job link buttons.
	3) Delete post button


Read more about frontend in [Front-end wiki](https://github.com/haxxorsid/referralboard/wiki/Frontend-Documentation).

Read more about backend in [API wiki](https://github.com/haxxorsid/referralboard/wiki/API-Reference).

Read more about them here in [Database wiki](https://github.com/haxxorsid/referralboard/wiki/Database-Schema).

## Testing
- Frontend Unit test cases (Login)
- Backend Unit test cases (Register)
- Cypress Integration test cases (Login, register, navbar)
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

- [Front-End](https://youtu.be/31TlV_LSyz0)
- [Back-End](https://youtu.be/Ysom7pKaPNg)
