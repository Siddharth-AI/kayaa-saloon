ok thank you bro because of you we have created somthing good.
now we have to make order page in this we will show user his order and ok.

all order of user->
api GET -> http://localhost:3000/api/order/get?limit=10&page=1&vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
header token required.
params -> location uuid.
response->{
"status": true,
"message": "Records Found",
"fromCache": false,
"data": {
"message": "Successfully get all record.",
"code": 200,
"data": {
"count": 8,
"rows": [
{
"id": 397,
"uuid": "c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1",
"ref_no": "20250717164946",
"po_date": "2025-12-07",
"po_number": "45",
"order_status": "open",
"total": 420,
"total_qty": 3,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 396,
"uuid": "12f4cc8c-a6cd-4ee0-ac4f-97a706ae6149",
"ref_no": "20250717164946",
"po_date": "2025-12-07",
"po_number": "44",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 395,
"uuid": "e3f93d3d-52f2-4af0-b7bb-20f45b694f04",
"ref_no": "20250717164946",
"po_date": "2025-12-07",
"po_number": "43",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 388,
"uuid": "de8ed91b-5170-4e69-845d-8e0e44b3a81d",
"ref_no": "202507171649469",
"po_date": "2025-12-07",
"po_number": "42",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 385,
"uuid": "b6801c9c-f963-40a1-bc05-f23d437b3c7b",
"ref_no": "202507171649469",
"po_date": "2025-12-07",
"po_number": "41",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 382,
"uuid": "cb4dc217-5aae-4d84-8bda-abefb4766ccb",
"ref_no": "202507171649469",
"po_date": "2025-12-07",
"po_number": "40",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 380,
"uuid": "6c91a131-874e-4784-8ce6-08bb4f4f0e95",
"ref_no": "202507171649469",
"po_date": "2025-12-07",
"po_number": "39",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
},
{
"id": 378,
"uuid": "cf555849-ce9a-4ab1-b577-7c660b62d74d",
"ref_no": "202507171649469",
"po_date": "2025-12-07",
"po_number": "38",
"order_status": "open",
"total": 140,
"total_qty": 1,
"order_type": "online-delivery",
"remark": "Customer requested priority packaging"
}
]
}
}
}

get single order details-> c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1 -> this is order id 2. http://localhost:3000/api/order/c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
header token required
response -> {
"status": true,
"message": "Records Found",
"fromCache": false,
"data": {
"message": "Successfully get record.",
"code": 200,
"data": {
"id": 397,
"user_id": 114089,
"is_inclusive_tax": true,
"is_same_state": true,
"signature": null,
"po_number": "45",
"po_date": "2025-12-07",
"po_file": null,
"ref_no": "20250717164946",
"order_status": "open",
"remark": "Customer requested priority packaging",
"terms_conditions": null,
"order_by": 114089,
"billing_address_id": 251,
"shipping_address_id": 252,
"sale_by": 451,
"total_tax": 0,
"gross": null,
"total_qty": 3,
"total": 420,
"modified_by": null,
"order_type": "online-delivery",
"uuid": "c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1",
"user": {
"id": 114089,
"user_histories": [
{
"fname": "siddharth",
"lname": "",
"email": "sidsha5@gmail.com",
"mobile": "919915824156",
"registration_no": "TNY746",
"user_id": 114089,
"extra_details": null
}
]
},
"employee": {
"name": "Jason"
},
"sales_order_deliveries": [
{
"id": 317,
"invoice_id": 82715,
"sales_order_id": 397,
"delivery_date": null,
"total_qty": 3,
"total_amount": 420,
"order_data": {
"due_date": null,
"total_qty": 3,
"total_amount": 420,
"delivery_date": null,
"remaining_amount": 0,
"sales_order_items": [
{
"id": 474,
"tax": 0,
"cost": 120,
"name": "Hair-wac-qa2",
"unit": "ml",
"total": 420,
"discount": 0,
"createdAt": "2025-12-07T09:46:14.249Z",
"deletedAt": null,
"order_qty": 3,
"updatedAt": "2025-12-07T09:46:15.224Z",
"product_id": 45932,
"sell_price": 140,
"lot_details": null,
"measurement": 100,
"tax_group_id": null,
"delivered_qty": 0,
"sales_order_id": 397,
"cost_without_tax": 120
}
]
},
"remaining_amount": null,
"is_cancelled": false,
"round_off": null,
"due_date": null,
"additional_charge": 0,
"modified_by": null,
"created_by": 114089,
"delivery_json": null,
"bill": {
"id": 82715,
"price": 420,
"net": 420,
"discount": 0,
"tax": 0,
"total": 420,
"paid": 420,
"payment_status": "is_paid"
}
}
],
"sales_order_items": [
{
"id": 474,
"sales_order_id": 397,
"product_id": 45932,
"order_qty": 3,
"delivered_qty": 0,
"cost": 120,
"sell_price": 140,
"tax": 0,
"cost_without_tax": 120,
"total": 420,
"tax_group_id": null,
"discount": 0,
"lot_details": null,
"product": {
"name": "Hair-wac-qa2",
"status": 1,
"subcat_id": "115102",
"item_code": "12327864",
"unit": "ml",
"measurement": 100,
"stock": {
"available_qty": 14
},
"product_cat_subcategory": {
"name": "Conditioner"
}
},
"tax_group": null
}
],
"sales_order_taxes": [],
"billing_address": {
"id": 251,
"address_type": "billing",
"street_address": "near bhwarakua, it sector.",
"city": "indore",
"state": "mp",
"pincode": "456221",
"is_default": false,
"user_id": 114089
},
"shipping_address": {
"id": 252,
"address_type": "shipping",
"street_address": "near bhwarakua, it sector.",
"city": "indore",
"state": "mp",
"pincode": "456221",
"is_default": false,
"user_id": 114089
}
}
}
}

get payment status -> c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1 -> order id 3. api GET -> http://localhost:3000/api/order/c5f4b0e1-f30e-4ab1-8623-3fef3fe9c9d1/payment-status?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
header token required
response-> {
"status": true,
"message": "Records Found",
"fromCache": false,
"data": {
"message": "Successfully get record.",
"code": 200,
"data": {
"payment_status": "is_paid"
}
}
}

Delete order (cancle order) -> order id->a3932806-682c-47da-a140-ccca9c5fef0 4. api DELETE -> http://localhost:3000/api/order/a3932806-682c-47da-a140-ccca9c5fef0/cancel?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
response -> {
"message": "Order cancelled successfully",
"code": 200,
"data": {
"id": 165,
"uuid": "a3932806-682c-47da-a140-ccca9c5fef00",
"order_status": "cancelled",
"order_type": "online-delivery",
"total_qty": 11,
"total": 2249.1,
"user_id": 27071,
"po_date": "2025-08-25",
"ref_no": "202507171649461",
"po_number": "50",
"vendor_location_id": 100,
"updatedAt": "2025-08-21T08:08:19.783Z"
}
}

calculate summary 5. api POST -> http://localhost:3000/api/order/calculate-summary
header token required
body-> {
"vendor_location_uuid": "e5c7d567-e206-4cee-ac69-fa313d81cfdf",
"order_type": "online-pickup",(online-delivery)
"sales_order_date": "2025-12-07",
"products": [
{ "product_id": 29022, "ord_qty": 1 },
{ "product_id": 23255, "ord_qty": 1 }
]
}

this 5th api i dont now how to use ok so on order page we have this api we can see order and if clcik on order we see that order details ok so lets start make this also for me make redux and slice and pages for this also and also handle error if we get in this ok bro like we do in start
