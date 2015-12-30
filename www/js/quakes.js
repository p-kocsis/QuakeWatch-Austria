function quakeReport(referenzID,locLon,locLat,locPrecision,locLastUpdate,mlocPLZ,mlocOrtsname,stockwerk,klassifikation,verspuert,kommentar,kontakt){
    this.referenzID=referenzID;
    this.locLon=locLon;
    this.locLat=locLat;
    this.locPrecision=locPrecision;
    this.locLastUpdate=locLastUpdate;
    this.mlocPLZ=mlocPLZ;
    this.mlocOrtsname=mlocOrtsname;
    this.stockwerk=stockwerk;
    this.klassifikation=klassifikation;
    this.verspuert=verspuert;
    this.kommentar=kommentar;
    this.kontakt=kontakt;
}
function quakeData(id,magnitude,dateAndTime,locLon,locLat,country,distanceFromPhoneToQuake,classColor,ldate,ltime,ltz){
    this.id=id;
    this.magnitude=magnitude;
    this.dateAndTime=dateAndTime;
    this.locLon=locLon;
    this.locLat=locLat;
    this.country=country;
    this.distanceFromPhoneToQuake=distanceFromPhoneToQuake;
    this.classColor=classColor;
    this.ldate=ldate;
    this.ltime=ltime;
    this.ltz=ltz;
}