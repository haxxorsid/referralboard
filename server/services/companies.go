package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

// Get all companies
func GetAllCompanies(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	company := []models.Company{}
	db.Find(&company)
	RespondJSON(w, http.StatusOK, company)
}

// Fetch Company by Domain
func GetCompanyByDomain(db *gorm.DB, domain string) (models.Company, error) {
	var company models.Company
	err := db.Where(&models.Company{Domain: domain}).First(&company).Error
	return company, err
}
