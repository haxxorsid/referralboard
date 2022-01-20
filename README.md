# Referral Board
A referral network for top tech companies to get referral from verified professionals.

## Team members
- [Siddhesh Patil](https://github.com/haxxorsid)
- [Shashank Kumar](https://github.com/shashank136)
- [Vineet Khadloya](https://github.com/Vineetkhadloya)
- [Anjali Baheti](https://github.com/bahetianjali)

## Technology
- Go
- React (Typescript)
- Postgres 14.1.

## Problem Statement
As we struggle to find internships, full-time employment or new opportunities at top tech companies, this website will help individual connect with other individuals for getting and/or giving referrals. The website will let user register and request referrals from professionals working in target companies, similarly, you as a professional can refer others who wish to work at your place.

### Personas
- Referee : A referee is a user if he wishes to find referrals.
- Referrer : A referrer is a user if he wishes to give referrals to individuals (potential referees) seeking opportunity at their company. A referrer can also request referrals (can be a referee) if looking for new opportunities.

### Common actions
- Login
- Register
- Create a post for requesting referral. Fields visible in the post:
    - First name (hidden)
    - Last name (hidden)
    - Email (hidden)
    - Contact (hidden)
    - Resume (hidden)
    - Years of Experience
    - Current location
    - Current title (Student, software engineer, etc.)
    - Current organization (like university name or current company name)
    - About himself
    - Target company name
    - Target position title
    - Job Id
    The hidden values (firstname, lastname, ...) can be revealed/seen by potential referrers. They are hidden by default and visible once the potential referrer clicks on a "Reveal candidate" button on the post. Why? Because, in future we can limit number of candidates referrers can see per day (**enhancement**), this will help in fighting mischief or stealing data. Further **enhacement** can be limiting number of posts per day a referee can make to find referrals.
- Authenticate using organization email
- List all previous posts made by this user.
- Delete post. In future, referee might be able to provide a reason of deletion as = “I received a referral” (**ehancement**).

### Actions per persona
- Referee
    - Common actions
-	Referrer
    - Common actions
    - View posts for referrals made for this user's company.
    - Reveal candidate button on the post.
    - Future **enhancement**, "I referred the candidate" button on the post, this will remove the post to avoid other existing employees again referring the user.

