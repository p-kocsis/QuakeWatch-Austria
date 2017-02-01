# Abfrage per CLI
## Key holen
curl -D - -X "POST" http://geoweb.zamg.ac.at/quakeapi/v02/getapikey -H "Authorization: Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=" -H "Content-Type: application/json; charset=utf-8"
## Hinzufügen von Erdbeben
curl -D - -X "POST" -H "X-QuakeAPIKey: 8415dcd4-e88e-11e6-a0a2-525401d06b63" --data-binary @./test2.json "http://geoweb.zamg.ac.at/quakeapi/v02/message" -H "Authorization: Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=" -H "Content-Type: application/json; charset=utf-8"