api GET-> https: //stage.dingg.app/api/v1/vendor/sales-order/online?limit=10&page=3&vendor_location_uuid=8a50afb3-cd38-4ff1-a9c8-b45076a11b74
header -> 1. auth token required 2. customer-uuid: "d4f1e8b3-5c6a-4e2b-9f3a-123456789abc" (example) (const customer_uuid = await getCustomerUuid(token);)
body->
response->{
"message": "Successfully get all record.",
"code": 200,
"data": {
"count": 84,
"rows": [
{
"id": 165,
"uuid": "a3932806-682c-47da-a140-ccca9c5fef00",
"ref_no": "202507171649461",
"po_date": "2025-08-25",
"po_number": "50",
"order_status": "cancelled",
"total": 2249.1,
"total_qty": 11,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 163,
"uuid": "adb9b7ea-cf42-48e8-a9f1-40befea90d83",
"ref_no": "202507171649461",
"po_date": "2025-07-31",
"po_number": "49",
"order_status": "open",
"total": 2249.1,
"total_qty": 11,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 161,
"uuid": "c5827e5a-1ac4-4ce3-95f9-b1b5036af2a8",
"ref_no": "202507171649461",
"po_date": "2025-07-31",
"po_number": "47",
"order_status": "delivered",
"total": 2249.1,
"total_qty": 11,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
]
}
}
