function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function distanceBetween(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(degreesToRadians(lat1))
            * Math.cos(degreesToRadians(lat2))
            * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}
function arePointsClose(lat1, lon1, lat2, lon2, radius) {
    return distanceBetween(lat1, lon1, lat2, lon2) <= radius;
}

module.exports = { arePointsClose, distanceBetween };
