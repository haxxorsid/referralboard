package models

import (
	"time"
)

type Card struct {
	Id         uint        `json:"cardId" gorm:"primary_key;column:card_id"`
	Title      string      `json:"title"`
	CreatedAt  time.Time   `json:"createdAt"`
}