package models

type YearsOfExperience struct {
	ID          int   `json:"yearsOfExperienceId" gorm:"primary_key;`
	Description string `json:"description"`
}
