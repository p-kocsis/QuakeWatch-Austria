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
function quakeReport(referenzID,locLon,locLat,locPrecision,locLastUpdate,mlocPLZ,mlocOrtsname,mlocStrasse,stockwerk,klassifikation,verspuert,kommentar,kontakt){
    this.referenzID=referenzID;
    this.locLon=locLon;
    this.locLat=locLat;
    this.locPrecision=locPrecision;
    this.locLastUpdate=locLastUpdate;
    this.mlocPLZ=mlocPLZ;
    this.mlocOrtsname=mlocOrtsname;
	this.mlocStrasse=mlocStrasse;
    this.stockwerk=stockwerk;
    this.klassifikation=klassifikation;
    this.verspuert=verspuert;
    this.kommentar=kommentar;
    this.kontakt=kontakt;
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