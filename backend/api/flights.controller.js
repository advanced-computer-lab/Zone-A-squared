import FlightsDAO from "../dao/flightsDAO.js"

export default class FlightsController {
  static async apiGetFlights(req, res, next) {

    
let filters = {}
    if (req.query.FlightNumber) {
      filters.FlightNumber = req.query.FlightNumber
    } else if (req.query.DepartureTime) {
      filters.DepartureTime = req.query.DepartureTime
    } else if (req.query.ArrivalTime) {
      filters.ArrivalTime = req.query.ArrivalTime
    } else if (req.query.Date) {
      filters.Date = req.query.Date
    } else if (req.query.Airport) {
      filters.Airport = req.query.Airport
    }
    


    const { flightsList, totalNumFlights } = await FlightsDAO.getFlights({
      filters,
    })

    let response = {
      flights: flightsList,
      filters: filters,
      total_results: totalNumFlights,
    }
    res.json(response)
  }

 
  static async apiPostFlight(req, res, next) {
    try {
      const FlightNumber = req.body.fnumber
      const DepartureTime= req.body.deptime
      const ArrivalTime= req.body.arrtime
      const Date = req.body.date
      const EconomySeats= req.body.ecseats
      const BusinessSeats=req.body.bseats
      const FirstSeats=req.body.fseats
      const Airport=req.body.airport
      

      const FlightResponse = await FlightsDAO.addFlight(
       FlightNumber,
       DepartureTime,
       ArrivalTime,
       Date,
       EconomySeats,
       BusinessSeats,
       FirstSeats,
       Airport
      )
      res.json({ status: "success" })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateFlight(req, res, next) {
    try {
      const flightId = req.body.id
      const Fnumber = req.body.fnumber
      const deptime = req.body.deptime
      const arrtime = req.body.arrtime
      const date = req.body.date
      const ecseats= req.body.ecseats
      const bseats=req.body.bseats
      const fseats=req.body.fseats
      const airport=req.body.airport

      const reviewResponse = await FlightsDAO.updateFlight(flightId, Fnumber, deptime, arrtime, date, ecseats, bseats, fseats, airport)
      var { error } = reviewResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteFlight(req, res, next) {
    try {
      const flightId = req.body.id
      const flightResponse = await FlightsDAO.deleteFlight(flightId)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
}
}