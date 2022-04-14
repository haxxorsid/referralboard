package models

// Company is the entity for Company table
type Company struct {
	ID     int   `json:"companyId" gorm:"primary_key;"`
	Name   string `json:"name"`
	Domain string `json:"domain"`
}
