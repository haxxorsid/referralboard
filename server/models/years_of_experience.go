package models

type YearsOfExperience struct {
	Id          uint   `json:"yearsOfExperienceId" gorm:"primary_key;column:years_of_experience_id"`
	Description string `json:"description"`
}