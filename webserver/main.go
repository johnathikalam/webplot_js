package main

import (
	"log"
	"net/http"
)

func main() {
	// read server settings
	settings, err := ReadServerSettings("settings.json")
	if err != nil {
		log.Fatal("Error reading settings.json")
	}

	// host the ui frontend
	fs := WPDFileSystem{http.Dir("../app")}
	http.Handle("/", http.FileServer(fs))

	// logging
	logging, err := InitLogging(settings)
	if err != nil {
		log.Fatal("Error enabling logging: ", err)
	}
	http.Handle("/log", logging)

	// data storage
	storage, err := InitStorage(settings)
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/storage/", storage)

	// start the server
	addr := settings.Hostname + ":" + settings.HTTPPort
	log.Println("Starting server on: ", addr)
	err = http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("Error starting server, exiting!")
	}
}
