module.exports = function () {
  return function (req, res, next) {
    var start = new Date()

    res.on('finish', function () {
      var reqTime = (new Date()) - start
      var cacheStatus = res.cacheStatus || 'miss'
      console.log(res.statusCode+" GET "+req.url+" in "+reqTime+" ms (cache "+cacheStatus+")")
    })

    next()
  }
}
