/**
 * @ngdoc object
 * @name quake
 * @description
 * # quake
 * Eine "Klasse" die für die Speicherung Empfangener bzw. neu eingegebener Daten
 * # quakeReport
 * Eine Klasse zum sammeln der Erdbebendaten (entprechend der /quakeapi/v01/)
 * <pre>
 *      new quakeReport(
 *          referenzID,
 *          locLon,
 *          locLat,
 *          locPrecision,
 *          locLastUpdate,
 *          mlocPLZ,
 *          mlocOrtsname,
 *			mlocStrasse,
 *          stockwerk,
 *          klassifikation,
 *          verspuert,
 *          kommentar,
 *          kontakt
 *      );
 * </pre>
 * # quakeData
 * Eine "Klasse" um die Erdbebendaten von jeglicher Quelle für die App verständlich zu machen.
 * <pre>
 *     new quakeData(
 *         id,
 *         magnitude,
 *         dateAndTime,
 *         locLon,
 *         locLat,
 *         country,
 *         distanceFromPhoneToQuake,
 *         classColor,
 *         ldate,
 *         ltime,
 *         ltz
 *     );
 * </pre>
 */
function quakeReport(referenzID,locLon,locLat,locPrecision,locLastUpdate,mlocPLZ,mlocOrtsname,stockwerk,klassifikation,verspuert,kommentar,kontakt,addquestions){
    this.referenzID=referenzID;
    this.locLon=locLon;
    this.locLat=locLat;
    this.locPrecision=locPrecision;
    this.locLastUpdate=locLastUpdate;
    this.mlocPLZ=mlocPLZ;
    this.mlocOrtsname=mlocOrtsname;
	//this.mlocStrasse=mlocStrasse;
    this.stockwerk=stockwerk;
    this.klassifikation=klassifikation;
    this.verspuert=verspuert;
    this.kommentar=kommentar;
    this.kontakt=kontakt;
    this.addquestions=addquestions;
}
function zusatzFragen() {
    //Sind Gegenstände umgefallen?
    this.f1;
    //Sind Sie aus Angst ins Freie geflüchtet?
    this.f2;
    //Feine Risse im Verputz?
    this.f3;
    //Hatten Sie Gleichgewichtsprobleme?
    this.f4;
    //Sind viele Gegenstände aus den Regalen gefallen?
    this.f5;
    //Sind Möbel umgekippt?
    this.f6;
    //Haben Sie Gebäudeschäden beobachtet?
    this.f7;
    //Risse im Verputz
    this.f8;
    //Abfallen von Verputzteilen
    this.f9;
    //Mauerrisse
    this.f10;
    //Beschädigung des Rauchfanges
    this.f11;
    //Herabfallen des Rauchfanges
    this.f12;
    //Herabfallen von Dachziegeln
    this.f13;
    //Einsturz von Zwischenwänden
    this.f14;
    //Bitte beschreiben Sie Ihre Wahrnehmung und Schäden
    this.f15;

}

function quakeData(id,magnitude,dateAndTime,locLon,locLat,depth,country,distanceFromPhoneToQuake,classColor,ldate,ltime,ltz){
    this.id=id;
    this.magnitude=magnitude;
    this.dateAndTime=dateAndTime;
    this.locLon=locLon;
    this.locLat=locLat;
    this.depth=depth;
    this.country=country;
    this.distanceFromPhoneToQuake=distanceFromPhoneToQuake;
    this.classColor=classColor;
    this.ldate=ldate;
    this.ltime=ltime;
    this.ltz=ltz;
}