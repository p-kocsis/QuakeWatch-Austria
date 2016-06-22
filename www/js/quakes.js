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
 *          mlocStrasse,
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
 *
 * # zusatzFragen
 * Eine "Klasse" um die zusatzfragen zu Erdbeben zu speichern (entprechend der /quakeapi/v02/)
 * <pre>
 *     zusatzFragen={
 *   //Sind Gegenstände umgefallen?
 *       f1:null,
 *
 *   //Sind Sie aus Angst ins Freie geflüchtet?
 *       f2:null,
 *
 *   //Feine Risse im Verputz?
 *       f3:null,
 *
 *   //Hatten Sie Gleichgewichtsprobleme?
 *       f4:null,
 *
 *   //Sind viele Gegenstände aus den Regalen gefallen?
 *       f5:null,
 *
 *   //Sind Möbel umgekippt?
 *       f6:null,
 *
 *   //Haben Sie Gebäudeschäden beobachtet?
 *       f7:null,
 *
 *   //Risse im Verputz
 *       f8:null,
 *
 *   //Abfallen von Verputzteilen
 *       f9:null,
 *
 *   //Mauerrisse
 *       f10:null,
 *
 *   //Beschädigung des Rauchfanges
 *       f11:null,
 *
 *   //Herabfallen des Rauchfanges
 *       f12:null,
 *
 *   //Herabfallen von Dachziegeln
 *       f13:null,
 *
 *   //Einsturz von Zwischenwänden
 *       f14:null,
 *
 *   //Bitte beschreiben Sie Ihre Wahrnehmung und Schäden
 *       f15:null
 *   };
 * </pre>
 *
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

var zusatzFragen={
    //Sind Gegenstände umgefallen?
        f1:null,

    //Sind Sie aus Angst ins Freie geflüchtet?
        f2:null,

    //Feine Risse im Verputz?
        f3:null,

    //Hatten Sie Gleichgewichtsprobleme?
        f4:null,

    //Sind viele Gegenstände aus den Regalen gefallen?
        f5:null,

    //Sind Möbel umgekippt?
        f6:null,

    //Haben Sie Gebäudeschäden beobachtet?
        f7:null,

    //Risse im Verputz
        f8:null,

    //Abfallen von Verputzteilen
        f9:null,

    //Mauerrisse
        f10:null,

    //Beschädigung des Rauchfanges
        f11:null,

    //Herabfallen des Rauchfanges
        f12:null,

    //Herabfallen von Dachziegeln
        f13:null,

    //Einsturz von Zwischenwänden
        f14:null,

    //Bitte beschreiben Sie Ihre Wahrnehmung und Schäden
        f15:null
};

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