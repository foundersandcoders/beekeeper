"use strict";

var Joi = require("joi");

/**
 *  Payment schema:
 *
 *  memberId:      {Number || String } id of the member associated with the payment
 *  subscription:  {Number}            subscription amount paid 
 *  donation:      {Number}            donation amount paid
 *  events:        {Number}            events amount paid
 *  total:         {Number}            the sum of (subscription + donation + events)
 *  error:         {Number}            error in case total is different from (subscription + donation + events)
 *  type:          {String}            type of payment
 *  listReference: {Number || String}  
 *  notes:         {String}            notes on the payment
 *
 */

/**
 *  Payment type.
 *
 *  The payment type can be one of the following:
 *
 *  CHQ:   cheque
 *  CASH:  cash
 *  SOA:   standing order payment advised (by member)
 *  SOR:   standing order received (and shown on bank statement)
 *  BACSA: BACS payment advised (by member)
 *  BACSR: BACS payment received by bank (and shown on bank statement)
 *  CAFA:  charities aid foundation payment advised by member
 *  CAFR:  charities aid foundation payment received by bank (shown on bank statement)
 *  HO:    payment received by Harbour Office along with harbour dues
 */


var paymentTypes = {
    CHQ:   "cheque",
    CASH:  "cash",
    SOA:   "standing order payment advised (by member)",
    SOR:   "standing order received (and shown on bank statement)",
    BACSA: "BACS payment advised (by member)",
    BACSR: "BACS payment received by bank (and shown on bank statement)",
    CAFA:  "charities aid foundation payment advised by member",
    CAFR:  "charities aid foundation payment received by bank (shown on bank statement)",
    HO:    "payment received by Harbour Office along with harbour dues"
};

var validateTypes = Object.keys(paymentTypes);

module.exports = {
    payload: {
        memberId:      Joi.any().required(),
        datePaid:      Joi.date().iso().required(),
        subscription:  Joi.number(),
        donation:      Joi.number(),
        events:        Joi.number(),
        total:         Joi.forbidden(),
        error:         Joi.number().forbidden(),
        typeCode:      Joi.string().valid(validateTypes).required(),
        listReference: Joi.string(),
        notes:         Joi.string().optional()
    }
};