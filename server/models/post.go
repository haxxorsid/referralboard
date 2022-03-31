package models

import (
	"time"
)

type Post struct {
	ID              int       `json:"postId" gorm:"primary_key;"`
	UserID          int       `json:"userId"`
	CompanyID 		int       `json:"targetCompanyId"`
	Position  		string    `json:"targetPosition"`
	Message         string    `json:"message"`
	Resume          string    `json:"resume" gorm:"type:string"`
	JobLink         string    `json:"jobLink"`
	CreatedAt       time.Time `json:"createdAt"`
	Company         Company   `json:"company,omitempty"`
	User         	User   	  `json:"user,omitempty"`
}
