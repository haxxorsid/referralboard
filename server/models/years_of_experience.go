package models

// YearsOfExperience is the entity for YearsOfExperience table
type YearsOfExperience struct {
	ID          int    `json:"yearsOfExperienceId" gorm:"primary_key"`
	Description string `json:"description"`
}
