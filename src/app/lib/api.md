1. api GET-> https://stage.dingg.app/api/v1/vendor/sales-order/:id?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
   header -> 1. auth token required
   requires params -> 1. id-> this is the sales order uuid , 2. vendor_location_uuid
   body-> none
   response->{
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

2. api GET-> https://stage.dingg.app/api/v1/vendor/sales-order/:order_uuid/payment-status?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
   header -> 1. auth token required
   requires params -> 1. ordere_uuid-> this is the sales order uuid , 2. vendor_location_uuid
   body-> none
   response-> {
   "message": "Successfully get record.",
   "code": 200,
   "data": {
   "payment_status": "is_paid"
   }
   }

3. api DELETE-> https://stage.dingg.app/api/v1/vendor/sales-order/online/:uuid?vendor_location_uuid=e5c7d567-e206-4cee-ac69-fa313d81cfdf
   header -> 1. auth token required
   requires params -> 1. uuid-> this is the sales order uuid , 2. vendor_location_uuid
   body-> none
   response->{
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

4. api POST-> https://stage.dingg.app/api/v1/user/calculate-summary
   header -> 1. auth token required
   body->{
   "vendor_location_uuid":"e5c7d567-e206-4cee-ac69-fa313d81cfdf",
   "order_type":"online-pickup", //online-pickup
   "sales_order_date":"2025-12-07",
   "products":[
   {
   "product_id": 29022,
   "ord_qty": 1
   },{
   "product_id": 23255,
   "ord_qty": 1
   }
   ]
   }
   response->{
   "message": "Success!",
   "code": 200,
   "data": {
   "total": 3899,
   "product_sub": 3899,
   "tax": 0,
   "discount": 0,
   "delivery_charges": 0,
   "net": 3899,
   "total_payable": 3899,
   "remark": "product will be ready for pickup from store"
   }
   }

5. customer-uuid: "d4f1e8b3-5c6a-4e2b-9f3a-123456789abc" (example) (const customer_uuid = await getCustomerUuid(token);)
