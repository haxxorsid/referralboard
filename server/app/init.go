package app

import (
	"time"

	"github.com/haxxorsid/referralboard/server/models"
	"golang.org/x/crypto/bcrypt"
)

// SetUpDB method creates database objects (tables in this case) with the required dummy data.
func (a *App) SetUpDB() {

	// Drop the table if it exists
	a.DB.Migrator().DropTable(&models.Post{})
	a.DB.Migrator().DropTable(&models.User{})
	a.DB.Migrator().DropTable(&models.Company{})
	a.DB.Migrator().DropTable(&models.YearsOfExperience{})

	// Migrate the schema
	a.DB.AutoMigrate(&models.YearsOfExperience{}, &models.Company{}, &models.User{}, &models.Post{})
	// Create Years of Experience table data
	a.DB.Create(&models.YearsOfExperience{Description: "0 Years/Student/Intern"})
	a.DB.Create(&models.YearsOfExperience{Description: "0 - 1 Years"})
	a.DB.Create(&models.YearsOfExperience{Description: "1 - 3 Years"})
	a.DB.Create(&models.YearsOfExperience{Description: "3 - 5 Years"})
	a.DB.Create(&models.YearsOfExperience{Description: "5 - 7 Years"})
	a.DB.Create(&models.YearsOfExperience{Description: "7 - 10 Years"})
	a.DB.Create(&models.YearsOfExperience{Description: "10+ Years"})

	// Create Company table data
	a.DB.Create(&models.Company{Name: "Company A", Domain: "companya.com"})
	a.DB.Create(&models.Company{Name: "Company B", Domain: "companyb.com"})
	a.DB.Create(&models.Company{Name: "Company C", Domain: "companyc.com"})
	a.DB.Create(&models.Company{Name: "Company D", Domain: "companyd.com"})

	// Create User table data
	password, _ := bcrypt.GenerateFromPassword([]byte("root"), bcrypt.DefaultCost)
	verified := true
	a.DB.Create(&models.User{FirstName: "Firstname1", LastName: "Lastname1", Email: "mailaddress1@companya.com", Password: string(password), Location: "Florida", CompanyID: 1, CompanyName: "Company A", Position: "Intern", YearsOfExperienceID: 1, School: "UF", Verified: &verified})
	a.DB.Create(&models.User{FirstName: "Firstname2", LastName: "Lastname2", Email: "mailaddress2@companyb.com", Password: string(password), Location: "California", CompanyID: 2, CompanyName: "Company B", Position: "Intern", YearsOfExperienceID: 1, School: "UF", Verified: &verified})
	a.DB.Create(&models.User{FirstName: "Firstname3", LastName: "Lastname3", Email: "mailaddress3@companyc.com", Password: string(password), Location: "California", CompanyID: 3, CompanyName: "Company C", Position: "Software Engineer", YearsOfExperienceID: 2, School: "UF", Verified: &verified})
	verified = false
	a.DB.Create(&models.User{FirstName: "Firstname4", LastName: "Lastname4", Email: "mailaddress4@gmail.com", Password: string(password), Location: "California", CompanyName: "Company D", Position: "Student", YearsOfExperienceID: 3, School: "UF", Verified: &verified})

	// Create Post table data
	a.DB.Create(&models.Post{UserID: 1, CompanyID: 2, Position: "Software Engineer", Message: "Message 1", Resume: "https://www.google.com", JobLink: "https://www.companyb.com/jobid/123", CreatedAt: time.Now()})
	a.DB.Create(&models.Post{UserID: 2, CompanyID: 3, Position: "Software Engineer 2", Message: "Message 2", Resume: "https://www.google.com", JobLink: "https://www.companyc.com/jobid/123", CreatedAt: time.Now()})
	a.DB.Create(&models.Post{UserID: 1, CompanyID: 4, Position: "Software Engineer", Message: "Message 3", Resume: "https://www.google.com", JobLink: "https://www.companyc.com/jobid/456", CreatedAt: time.Now()})
	a.DB.Create(&models.Post{UserID: 4, CompanyID: 1, Position: "Product Manager", Message: "Message 4", Resume: "https://www.google.com", JobLink: "https://www.companya.com/jobid/123", CreatedAt: time.Now()})
}
