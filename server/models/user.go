package models

type User struct {
	Id                  int    `json:"userId" gorm:"primary_key;column:user_id;not null"`
	FirstName           string `json:"firstName" gorm:"column:first_name;not null;default:null" validate:"required"`
	LastName            string `json:"lastName" gorm:"column:last_name;not null;default:null" validate:"required"`
	CurrentLocation     string `json:"currentLocation" gorm:"column:current_location;not null;default:null" validate:"required"`
	CurrentCompanyId    int   `json:"currentCompanyId" gorm:"column:current_company_id;default:null"`
	CurrentCompanyName  string `json:"currentCompanyName" gorm:"column:current_company_name;not null;default:null" validate:"required"`
	CurrentPosition     string `json:"currentPosition" gorm:"column:current_position;not null;default:null" validate:"required"`
	School              string `json:"school" gorm:"column:school;not null;default:null" validate:"required"`
	YearsOfExperienceId int   `json:"yearsOfExperienceId" gorm:"column:years_of_experience_id;not null;default:null" validate:"required"`
	Email               string `json:"email" gorm:"column:email;uniqueIndex:uq_users_email;not null;default:null" validate:"required,email"`
	Password            string `json:"password" gorm:"column:password_hash;not null;default:null" validate:"required"`
	Verified            *bool   `json:"verified" gorm:"column:verified;not null;default:false"`
	Posts               []Post `json:"posts,omitempty" gorm:"foreignKey:user_id;references:Id"`
}

type UserProfile struct {
	FirstName           string `json:"firstName" validate:"required"`
	LastName            string `json:"lastName" validate:"required"`
	CurrentLocation     string `json:"currentLocation" validate:"required"`
	CurrentCompanyName  string `json:"currentCompanyName" validate:"required"`
	CurrentPosition     string `json:"currentPosition" validate:"required"`
	School              string `json:"school" validate:"required"`
	YearsOfExperienceId int    `json:"yearsOfExperienceId" validate:"required"`	
}

type UserEmail struct {
	Email               string `json:"email" validate:"required,email"`
}

type UserPassword struct {
	CurrentPassword     string `json:"currentPassword" validate:"required"`
	NewPassword         string `json:"newPassword" validate:"required"`
}