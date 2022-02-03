package models

type Company struct {
	Id     uint   `json:"companyId" gorm:"primary_key;column:company_id"`
	Name   string `json:"name"`
	Domain string `json:"domain"`
}
