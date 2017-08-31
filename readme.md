# Projektbeschreibung
Entwicklung einer mobilen Applikation mithilfe von einem hybriden Webapplikationsframework(ionic 1) für folgende Funktionen:

"
- Alles über Erdbeben in Österreich und der Welt
- Melden Sie uns auf einfache Weise Ihre Wahrnehmungen und Schäden
- Ratgeber: Richtiges Verhalten während eines Bebens
- Wie weit bin ich vom Beben entfernt
- Sortierbar nach Österreich/ EU/ Welt
- Anzeige auf Landkarten
"
-Zitat von der QuakeWatch Austria Google Play Store Beschreibung.
https://play.google.com/store/apps/details?id=com.ionicframework.quakewatch411119

# Entwicklerinformationen
## Abfrage per CLI
### Key holen
curl -D - -X "POST" http://geoweb.zamg.ac.at/quakeapi/v02/getapikey -H "Authorization: Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=" -H "Content-Type: application/json; charset=utf-8"
### Hinzufügen von Erdbeben
curl -D - -X "POST" -H "X-QuakeAPIKey: 8415dcd4-e88e-11e6-a0a2-525401d06b63" --data-binary @./test2.json "http://geoweb.zamg.ac.at/quakeapi/v02/message" -H "Authorization: Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=" -H "Content-Type: application/json; charset=utf-8"
