package models

type User struct {
	Id                  int    `json:"userId" gorm:"primary_key;column:user_id"`
	FirstName           string `json:"firstName" gorm:"column:first_name"`
	LastName            string `json:"lastName" gorm:"column:last_name"`
	CurrentLocation     string `json:"currentLocation" gorm:"column:current_location"`
	CurrentCompanyId    uint   `json:"currentCompanyId" gorm:"column:current_company_id"`
	CurrentCompanyName  string `json:"currentCompanyName" gorm:"column:current_company_name"`
	CurrentPosition     string `json:"currentPosition" gorm:"column:current_position"`
	School              string `json:"school"`
	YearsOfExperienceId uint   `json:"yearsOfExperienceId" gorm:"column:years_of_experience_id"`
	Email               string `json:"email" gorm:"column:email;uniqueIndex:uq_users_email"`
	Password            string `json:"password" gorm:"column:password_hash"`
}
