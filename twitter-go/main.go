package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"

	"syscall"
	"time"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"github.com/go-redis/redis"
)

// Config : config struct for twitter keys
type Config struct {
	APIKEY            string `json:"apiKey"`
	APISECRET         string `json:"apiSecret"`
	ACCESSTOKENKEY    string `json:"accessTokenKey"`
	ACCESSTOKENSECRET string `json:"accessTokenSecret"`
}

// Tweet : struct used for serializing/deserializing data(tweets) in Elasticsearch
type Tweet struct {
	User     string    `json:"user"`
	Message  string    `json:"message"`
	Retweets int       `json:"retweets"`
	Image    string    `json:"image,omitempty"`
	Created  time.Time `json:"created,omitempty"`
	Tags     []string  `json:"tags,omitempty"`
	Location string    `json:"location,omitempty"`
	Country  string    `json:"country,omitempty"`
	Language string    `json:"language,omitempty"`
}

// LoadConfiguration : loads config from json file
func LoadConfiguration(file string) Config {
	var config Config
	configFile, errFile := os.Open(file)
	defer configFile.Close()
	if errFile != nil {
		fmt.Println("Error opening file", errFile.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	errParse := jsonParser.Decode(&config)
	if errParse != nil {
		fmt.Println("Error opening file", errParse.Error())
	}
	return config
}

func main() {
	configuration := LoadConfiguration("conf.json")

	config := oauth1.NewConfig(configuration.APIKEY, configuration.APISECRET)
	token := oauth1.NewToken(configuration.ACCESSTOKENKEY, configuration.ACCESSTOKENSECRET)
	httpClient := config.Client(oauth1.NoContext, token)

	// ctx := context.Background()

	// Twitter client
	twitterClient := twitter.NewClient(httpClient)
	// SwitchDemux used to handle different types of messages (tweets, DMs...)
	demux := twitter.NewSwitchDemux()

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	pong, err := redisClient.Ping().Result()
	fmt.Println(pong, err)

	words := [...]string{"hello", "the", "be", "to", "today", "morning", "evening", "afternoon", "night"}

	// If a tweet contains any of the key words, increment its key in redis
	demux.Tweet = func(tweet *twitter.Tweet) {
		text := strings.ToLower(tweet.Text)
		for i := 0; i < len(words); i++ {
			if strings.Contains(text, words[i]) {
				fmt.Println(words[i])
				err := redisClient.Incr("keyword{word=\"" + words[i] + "\"}").Err()
				if err != nil {
					panic(err)
				}
			}
		}
	}

	params := &twitter.StreamSampleParams{
		StallWarnings: twitter.Bool(true),
	}

	// Get a sample stream of tweets
	stream, err := twitterClient.Streams.Sample(params)

	// Get demux to handle stream of tweets
	go demux.HandleChan(stream.Messages)

	// Wait for cancel (CTRL-C)
	ch := make(chan os.Signal)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	log.Println(<-ch)
	log.Println(err)

	stream.Stop()
}
