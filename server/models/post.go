package models

import (
	"time"
)

type Post struct {
	Id              uint      `json:"postId" gorm:"primary_key;column:post_id"`
	UserId          uint      `json:"userId" gorm:"column:user_id"`
	TargetCompanyId uint      `json:"targetCompanyId" gorm:"column:target_company_id"`
	TargetPosition  string    `json:"targetPosition" gorm:"column:target_position"`
	Message         string    `json:"message"`
	Resume          string    `json:"resume" gorm:"type:string"`
	JobLink         string    `json:"jobLink" gorm:"column:job_link"`
	CreatedAt       time.Time `json:"createdAt"`
}
