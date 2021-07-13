function coordinate(lat, long) {
  let _lat = lat;
  let _long = long;

  return {
    translate: (dx, dy) => {
      return coordinate(_lat + dx, _long + dy);
    },
    toString: () => `(${_lat},${_long})`,
  };
}

function zipCode(code, location) {
  let _code = code;
  let _location = location;
  return {
    code: function() {
      return _code
    },
    toString: () => `${_code}-${_location}`,
  };
}

module.exports = {
  zipCode,
  coordinate,
};
