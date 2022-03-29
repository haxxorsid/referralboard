package app

import (
	"time"

	"github.com/haxxorsid/referralboard-private/server/models"
	"golang.org/x/crypto/bcrypt"
)

func (a *App) SetUpDB() {

	// Drop the table if it exists
	a.DB.Migrator().DropTable(&models.Post{})
	a.DB.Migrator().DropTable(&models.User{})
	a.DB.Migrator().DropTable(&models.Company{})
	a.DB.Migrator().DropTable(&models.YearsOfExperience{})

	// Migrate the schema
	a.DB.AutoMigrate(&models.YearsOfExperience{}, &models.Company{})
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
	a.DB.Create(&models.User{FirstName: "Shashank", LastName: "Kumar", Email: "mailaddress2@companya.com", Password: string(password), CurrentLocation: "Florida", CurrentCompanyId: 1, CurrentCompanyName: "Company A", CurrentPosition: "Intern", YearsOfExperienceId: 1, School: "UF", Verified: &verified})
	a.DB.Create(&models.User{FirstName: "John", LastName: "Doe", Email: "mailaddress1@companyb.com", Password: string(password), CurrentLocation: "California", CurrentCompanyId: 2, CurrentCompanyName: "Company B", CurrentPosition: "Intern", YearsOfExperienceId: 1, School: "UF", Verified: &verified})
	a.DB.Create(&models.User{FirstName: "user3", LastName: "demo3", Email: "mailaddress3@companyc.com", Password: string(password), CurrentLocation: "California", CurrentCompanyId: 3, CurrentCompanyName: "Company C", CurrentPosition: "Software Engineer", YearsOfExperienceId: 2, School: "UF", Verified: &verified})
	a.DB.Create(&models.User{FirstName: "user4", LastName: "demo4", Email: "mailaddress4@gmail.com", Password: string(password), CurrentLocation: "California", CurrentCompanyId: 1, CurrentCompanyName: "UF", CurrentPosition: "Student", YearsOfExperienceId: 3, School: "UF", Verified: &verified})

	// Create Post table data
	a.DB.Create(&models.Post{UserId: 1, TargetCompanyId: 2, TargetPosition: "Software Engineer", Message: "Message 1", Resume: "https://www.google.com", JobLink: "https://www.companyb.com/jobid/123", CreatedAt: time.Now()})
	a.DB.Create(&models.Post{UserId: 2, TargetCompanyId: 3, TargetPosition: "Software Engineer 2", Message: "Message 2", Resume: "https://www.google.com", JobLink: "https://www.companyb.com/jobid/456", CreatedAt: time.Now()})
	a.DB.Create(&models.Post{UserId: 1, TargetCompanyId: 3, TargetPosition: "Software Engineer", Message: "Message 3", Resume: "https://www.google.com", JobLink: "https://www.companyb.com/jobid/567", CreatedAt: time.Now()})

}
