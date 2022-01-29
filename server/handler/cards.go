package handler

import (
    "net/http"
	"github.com/haxxorsid/referralboard-private/server/models"
	"gorm.io/gorm"
)

func GetAllCards(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	cards := []models.Card{}
	db.Find(&cards)
	RespondJSON(w, http.StatusOK, cards)
}