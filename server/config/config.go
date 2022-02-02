package config

type Config struct {
	DB *DBConfig
}

type DBConfig struct {
	Host     string
	User     string
	Password string
	Dbname   string
	Port     string
	Sslmode  string
	TimeZone string
}

func GetConfig() *Config {
	return &Config{
		DB: &DBConfig{
			Host:     "localhost",
			User:     "shashank",
			Password: "root",
			Dbname:   "appdb",
			Port:     "5432",
			Sslmode:  "disable",
			TimeZone: "America/New_York",
		},
	}
}
