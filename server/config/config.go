package config

// Config struct is providing credentials for connecting with the database
type Config struct {
	DB *DBConfig
}

// DBConfig struct is providing credentials for connecting with the database
type DBConfig struct {
	Host     string
	User     string
	Password string
	Dbname   string
	Port     string
	Sslmode  string
	TimeZone string
}

// GetConfig method returns config with default credentials
func GetConfig() *Config {
	return &Config{
		DB: &DBConfig{
			Host:     "localhost",
			User:     "username",
			Password: "password",
			Dbname:   "appdb",
			Port:     "5432",
			Sslmode:  "disable",
			TimeZone: "America/New_York",
		},
	}
}
