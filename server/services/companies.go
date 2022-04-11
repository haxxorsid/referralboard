package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

// GetAllCompanies fetches all companies
func GetAllCompanies(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	company := []models.Company{}
	db.Find(&company)
	RespondJSON(w, http.StatusOK, company)
}

// GetCompanyByDomain fetches Company by Domain
func GetCompanyByDomain(db *gorm.DB, domain string) (models.Company, error) {
	var company models.Company
	err := db.Where(&models.Company{Domain: domain}).First(&company).Error
	return company, err
}

// GetCompanyByID fetches Company by id
func GetCompanyByID(db *gorm.DB, id int) (models.Company, error) {
	var company models.Company
	err := db.Where(&models.Company{ID: id}).First(&company).Error
	return company, err
}
