// ─── PROPERTIES ─────────────────────────────────────────────────────────────
export const properties = [
  {
    id:'p1', name:'Harmony PG', city:'Bangalore', locality:'Koramangala',
    price:8500, type:'PG', gender:'Any', sharing:['Single','Double','Triple'],
    rating:4.6, reviews:124, available:3, total:20,
    owner:'Rajesh Kumar', ownerId:'o1', lat:12.9352, lng:77.6245,
    images:[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    ],
    description:'Premium co-living in the heart of Koramangala with modern amenities and a vibrant community of working professionals.',
    amenities:['WiFi','AC','Meals','Laundry','Parking','CCTV','Security'],
    propertyFeatures:{
      water:true, powerBackup:true, wifi:true, lift:true, parking:'Bike+Car',
      cctv:true, securityGuard:true, gatedCommunity:true, visitorManagement:true, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:true, hotWater:true, ac:true, wardrobe:true, bed:true,
      studyTable:true, balcony:false, ventilation:true, naturalLight:true, soundproofing:false,
    },
    kitchen:{
      modularKitchen:true, refrigerator:true, microwave:true, inductionStove:true,
      washingMachine:true, waterPurifier:true, clothesDrying:true,
    },
    connectivity:{
      mobileSignal:'Excellent', internetSpeed:'300 Mbps Fiber', nearBusStop:true,
      nearMetro:'500m', nearOffice:true, nearGrocery:true, nearHospital:true, foodDelivery:true,
    },
    security:{
      smartLocks:true, windowGrills:true, emergencyExit:true, safeNeighborhood:true,
    },
    agreement:{
      monthlyRent:8500, securityDeposit:17000, noticePeriod:'30 days',
      lockInPeriod:'3 months', maintenanceCharges:500, electricityBill:'Per unit (₹8/unit)',
      waterCharges:'Included', parkingCharges:'₹300/month (bike)', guestPolicy:'Allowed till 10 PM',
      refundTerms:'Full refund within 7 days after checkout', rentIncreaseClause:'10% annual',
      moveOutRules:'Prior notice + room inspection required',
    },
    priorityScore:{ safety:9, water:10, power:9, internet:10, location:9, affordability:7, washroom:9, parking:8, lift:8, agreement:9 },
  },
  {
    id:'p2', name:'Urban Nest', city:'Bangalore', locality:'HSR Layout',
    price:7200, type:'Co-Living', gender:'Male', sharing:['Double','Triple'],
    rating:4.3, reviews:87, available:6, total:30,
    owner:'Sunita Reddy', ownerId:'o2', lat:12.9116, lng:77.6389,
    images:[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    ],
    description:'Affordable co-living for working professionals in HSR Layout with gym, all meals and great community.',
    amenities:['WiFi','Meals','Gym','CCTV','Parking'],
    propertyFeatures:{
      water:true, powerBackup:true, wifi:true, lift:false, parking:'Bike',
      cctv:true, securityGuard:false, gatedCommunity:false, visitorManagement:false, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:false, hotWater:true, ac:false, wardrobe:true, bed:true,
      studyTable:true, balcony:false, ventilation:true, naturalLight:true, soundproofing:false,
    },
    kitchen:{
      modularKitchen:false, refrigerator:true, microwave:true, inductionStove:false,
      washingMachine:true, waterPurifier:true, clothesDrying:true,
    },
    connectivity:{
      mobileSignal:'Good', internetSpeed:'100 Mbps', nearBusStop:true,
      nearMetro:'1.2km', nearOffice:true, nearGrocery:true, nearHospital:true, foodDelivery:true,
    },
    security:{ smartLocks:false, windowGrills:true, emergencyExit:true, safeNeighborhood:true },
    agreement:{
      monthlyRent:7200, securityDeposit:14400, noticePeriod:'30 days',
      lockInPeriod:'2 months', maintenanceCharges:300, electricityBill:'Included (Fair use)',
      waterCharges:'Included', parkingCharges:'₹200/month (bike)', guestPolicy:'Allowed till 9 PM',
      refundTerms:'Refund within 15 days after checkout', rentIncreaseClause:'8% annual',
      moveOutRules:'Prior notice required',
    },
    priorityScore:{ safety:7, water:9, power:8, internet:8, location:8, affordability:9, washroom:6, parking:6, lift:4, agreement:7 },
  },
  {
    id:'p3', name:'Serene Stays', city:'Hyderabad', locality:'Madhapur',
    price:9000, type:'PG', gender:'Female', sharing:['Single','Double'],
    rating:4.8, reviews:203, available:2, total:15,
    owner:'Priya Sharma', ownerId:'o1', lat:17.4486, lng:78.3908,
    images:[
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    description:'Exclusive female PG with 24/7 security, housekeeping, all meals and premium amenities.',
    amenities:['WiFi','AC','Meals','Security','Housekeeping','CCTV'],
    propertyFeatures:{
      water:true, powerBackup:true, wifi:true, lift:true, parking:'Bike',
      cctv:true, securityGuard:true, gatedCommunity:true, visitorManagement:true, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:true, hotWater:true, ac:true, wardrobe:true, bed:true,
      studyTable:true, balcony:true, ventilation:true, naturalLight:true, soundproofing:true,
    },
    kitchen:{
      modularKitchen:true, refrigerator:true, microwave:true, inductionStove:true,
      washingMachine:true, waterPurifier:true, clothesDrying:true,
    },
    connectivity:{
      mobileSignal:'Excellent', internetSpeed:'200 Mbps', nearBusStop:true,
      nearMetro:'800m', nearOffice:true, nearGrocery:true, nearHospital:true, foodDelivery:true,
    },
    security:{ smartLocks:true, windowGrills:true, emergencyExit:true, safeNeighborhood:true },
    agreement:{
      monthlyRent:9000, securityDeposit:18000, noticePeriod:'30 days',
      lockInPeriod:'3 months', maintenanceCharges:400, electricityBill:'Per unit (₹7/unit)',
      waterCharges:'Included', parkingCharges:'₹250/month', guestPolicy:'Female guests only till 8 PM',
      refundTerms:'Full refund within 10 days', rentIncreaseClause:'10% annual',
      moveOutRules:'Inspection mandatory before refund',
    },
    priorityScore:{ safety:10, water:10, power:10, internet:9, location:9, affordability:6, washroom:10, parking:7, lift:9, agreement:9 },
  },
  {
    id:'p4', name:'The Hub', city:'Pune', locality:'Baner',
    price:6800, type:'Co-Living', gender:'Any', sharing:['Double','Triple'],
    rating:4.4, reviews:56, available:8, total:25,
    owner:'Amit Joshi', ownerId:'o3', lat:18.5590, lng:73.7868,
    images:[
      'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    description:'Modern co-living hub for young professionals and students in Baner with gym and terrace.',
    amenities:['WiFi','Meals','Gym','Terrace','Parking'],
    propertyFeatures:{
      water:true, powerBackup:false, wifi:true, lift:false, parking:'Bike+Car',
      cctv:true, securityGuard:false, gatedCommunity:false, visitorManagement:false, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:false, hotWater:true, ac:false, wardrobe:true, bed:true,
      studyTable:true, balcony:false, ventilation:true, naturalLight:true, soundproofing:false,
    },
    kitchen:{
      modularKitchen:false, refrigerator:true, microwave:false, inductionStove:true,
      washingMachine:true, waterPurifier:true, clothesDrying:true,
    },
    connectivity:{
      mobileSignal:'Good', internetSpeed:'150 Mbps', nearBusStop:true,
      nearMetro:'2km', nearOffice:true, nearGrocery:true, nearHospital:false, foodDelivery:true,
    },
    security:{ smartLocks:false, windowGrills:true, emergencyExit:false, safeNeighborhood:true },
    agreement:{
      monthlyRent:6800, securityDeposit:13600, noticePeriod:'15 days',
      lockInPeriod:'1 month', maintenanceCharges:200, electricityBill:'Included',
      waterCharges:'Included', parkingCharges:'Free', guestPolicy:'Allowed till 11 PM',
      refundTerms:'Refund within 20 days', rentIncreaseClause:'8% annual',
      moveOutRules:'7 days notice required',
    },
    priorityScore:{ safety:6, water:8, power:5, internet:8, location:7, affordability:10, washroom:5, parking:8, lift:3, agreement:7 },
  },
  {
    id:'p5', name:'Green Villa PG', city:'Bangalore', locality:'Indiranagar',
    price:11000, type:'PG', gender:'Any', sharing:['Single'],
    rating:4.9, reviews:312, available:1, total:12,
    owner:'Rajesh Kumar', ownerId:'o1', lat:12.9784, lng:77.6408,
    images:[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    ],
    description:'Luxury single-occupancy PG in Indiranagar — premium living with all amenities.',
    amenities:['WiFi','AC','Meals','Laundry','Parking','Gym','Security'],
    propertyFeatures:{
      water:true, powerBackup:true, wifi:true, lift:true, parking:'Bike+Car',
      cctv:true, securityGuard:true, gatedCommunity:true, visitorManagement:true, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:true, hotWater:true, ac:true, wardrobe:true, bed:true,
      studyTable:true, balcony:true, ventilation:true, naturalLight:true, soundproofing:true,
    },
    kitchen:{
      modularKitchen:true, refrigerator:true, microwave:true, inductionStove:true,
      washingMachine:true, waterPurifier:true, clothesDrying:true,
    },
    connectivity:{
      mobileSignal:'Excellent', internetSpeed:'500 Mbps Fiber', nearBusStop:true,
      nearMetro:'300m', nearOffice:true, nearGrocery:true, nearHospital:true, foodDelivery:true,
    },
    security:{ smartLocks:true, windowGrills:true, emergencyExit:true, safeNeighborhood:true },
    agreement:{
      monthlyRent:11000, securityDeposit:22000, noticePeriod:'30 days',
      lockInPeriod:'3 months', maintenanceCharges:600, electricityBill:'Per unit (₹8/unit)',
      waterCharges:'Included', parkingCharges:'₹500/month (car)', guestPolicy:'Allowed till 10 PM',
      refundTerms:'Full refund within 7 days', rentIncreaseClause:'10% annual',
      moveOutRules:'Full inspection + cleaning required',
    },
    priorityScore:{ safety:10, water:10, power:10, internet:10, location:10, affordability:5, washroom:10, parking:9, lift:10, agreement:10 },
  },
  {
    id:'p6', name:'Metro Living', city:'Mumbai', locality:'Andheri West',
    price:13500, type:'Co-Living', gender:'Any', sharing:['Single','Double'],
    rating:4.5, reviews:178, available:4, total:20,
    owner:'Sunita Reddy', ownerId:'o2', lat:19.1136, lng:72.8697,
    images:[
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    ],
    description:'Premium co-living in Mumbai with rooftop terrace and city views. Perfect for corporates.',
    amenities:['WiFi','AC','Meals','Security','Terrace','CCTV','Lift'],
    propertyFeatures:{
      water:true, powerBackup:true, wifi:true, lift:true, parking:'Bike',
      cctv:true, securityGuard:true, gatedCommunity:true, visitorManagement:true, fireSafety:true,
    },
    roomFeatures:{
      attachedWashroom:true, hotWater:true, ac:true, wardrobe:true, bed:true,
      studyTable:false, balcony:true, ventilation:true, naturalLight:true, soundproofing:false,
    },
    kitchen:{
      modularKitchen:true, refrigerator:true, microwave:true, inductionStove:true,
      washingMachine:true, waterPurifier:true, clothesDrying:false,
    },
    connectivity:{
      mobileSignal:'Excellent', internetSpeed:'400 Mbps', nearBusStop:true,
      nearMetro:'200m', nearOffice:true, nearGrocery:true, nearHospital:true, foodDelivery:true,
    },
    security:{ smartLocks:true, windowGrills:true, emergencyExit:true, safeNeighborhood:true },
    agreement:{
      monthlyRent:13500, securityDeposit:27000, noticePeriod:'30 days',
      lockInPeriod:'3 months', maintenanceCharges:800, electricityBill:'Per unit (₹9/unit)',
      waterCharges:'Included', parkingCharges:'₹800/month (bike)', guestPolicy:'Allowed till 10 PM',
      refundTerms:'Refund within 10 days', rentIncreaseClause:'12% annual',
      moveOutRules:'Advance notice + inspection',
    },
    priorityScore:{ safety:9, water:10, power:10, internet:10, location:9, affordability:4, washroom:9, parking:6, lift:10, agreement:8 },
  },
];

// ─── ROOMS ──────────────────────────────────────────────────────────────────
export const rooms = [
  { id:'r1', propId:'p1', number:'101', floor:1, type:'Single', price:12000, status:'Occupied', tenantId:'t1' },
  { id:'r2', propId:'p1', number:'102', floor:1, type:'Double', price:8500, status:'Occupied', tenantId:'t2' },
  { id:'r3', propId:'p1', number:'103', floor:1, type:'Double', price:8500, status:'Available', tenantId:null },
  { id:'r4', propId:'p1', number:'201', floor:2, type:'Triple', price:6500, status:'Available', tenantId:null },
  { id:'r5', propId:'p1', number:'202', floor:2, type:'Single', price:12000, status:'Occupied', tenantId:'t3' },
  { id:'r6', propId:'p2', number:'101', floor:1, type:'Double', price:7200, status:'Occupied', tenantId:'t4' },
];

export const tenants = [
  { id:'t1', name:'Arjun Mehta', email:'arjun@gmail.com', phone:'9876543210', propId:'p1', roomId:'r1', checkIn:'2025-01-15', checkOut:'2025-12-31', rentStatus:'Paid', kyc:'Verified', advance:12000, occupation:'Software Engineer', company:'Infosys' },
  { id:'t2', name:'Sneha Patel', email:'sneha@gmail.com', phone:'9876543211', propId:'p1', roomId:'r2', checkIn:'2025-03-01', checkOut:'2025-09-30', rentStatus:'Pending', kyc:'Verified', advance:8500, occupation:'Student', company:'VTU' },
  { id:'t3', name:'Rahul Singh', email:'rahul@gmail.com', phone:'9876543212', propId:'p1', roomId:'r5', checkIn:'2025-02-10', checkOut:'2026-02-09', rentStatus:'Overdue', kyc:'Pending', advance:12000, occupation:'Marketing Manager', company:'Wipro' },
  { id:'t4', name:'Divya Nair', email:'divya@gmail.com', phone:'9876543213', propId:'p2', roomId:'r6', checkIn:'2025-04-01', checkOut:'2026-03-31', rentStatus:'Paid', kyc:'Verified', advance:7200, occupation:'CA', company:'Deloitte' },
];

export const payments = [
  { id:'pay1', tenantId:'t1', tenantName:'Arjun Mehta', propId:'p1', month:'June 2026', amount:12000, status:'Paid', date:'2026-06-01', method:'UPI', invoice:'INV-001' },
  { id:'pay2', tenantId:'t2', tenantName:'Sneha Patel', propId:'p1', month:'June 2026', amount:8500, status:'Pending', date:null, method:null, invoice:null },
  { id:'pay3', tenantId:'t3', tenantName:'Rahul Singh', propId:'p1', month:'June 2026', amount:12000, status:'Overdue', date:null, method:null, invoice:null },
  { id:'pay4', tenantId:'t4', tenantName:'Divya Nair', propId:'p2', month:'June 2026', amount:7200, status:'Paid', date:'2026-06-02', method:'Net Banking', invoice:'INV-002' },
  { id:'pay5', tenantId:'t1', tenantName:'Arjun Mehta', propId:'p1', month:'May 2026', amount:12000, status:'Paid', date:'2026-05-01', method:'UPI', invoice:'INV-003' },
  { id:'pay6', tenantId:'t2', tenantName:'Sneha Patel', propId:'p1', month:'May 2026', amount:8500, status:'Paid', date:'2026-05-03', method:'Card', invoice:'INV-004' },
];

export const serviceRequests = [
  { id:'sr1', tenantId:'t1', tenantName:'Arjun Mehta', propId:'p1', roomNo:'101', category:'Electrical', title:'Fan not working', desc:'Ceiling fan stopped working', status:'In Progress', priority:'High', created:'2026-06-05', assigned:'Ramesh (Electrician)' },
  { id:'sr2', tenantId:'t2', tenantName:'Sneha Patel', propId:'p1', roomNo:'102', category:'Plumbing', title:'Leaking tap', desc:'Bathroom tap leaking', status:'Open', priority:'Medium', created:'2026-06-07', assigned:null },
  { id:'sr3', tenantId:'t3', tenantName:'Rahul Singh', propId:'p1', roomNo:'202', category:'WiFi', title:'Internet not working', desc:'No internet since morning', status:'Completed', priority:'High', created:'2026-06-04', assigned:'IT Support' },
  { id:'sr4', tenantId:'t4', tenantName:'Divya Nair', propId:'p2', roomNo:'101', category:'Cleaning', title:'Deep cleaning required', desc:'Room needs deep cleaning', status:'Assigned', priority:'Low', created:'2026-06-06', assigned:'Housekeeping Team' },
];

export const revenueData = [
  { month:'Jan', revenue:127000, expenses:42000, occupancy:82 },
  { month:'Feb', revenue:134000, expenses:45000, occupancy:85 },
  { month:'Mar', revenue:142000, expenses:43000, occupancy:88 },
  { month:'Apr', revenue:138000, expenses:47000, occupancy:86 },
  { month:'May', revenue:151000, expenses:44000, occupancy:91 },
  { month:'Jun', revenue:149000, expenses:46000, occupancy:89 },
];

export const announcements = [
  { id:'a1', title:'Water Supply Interruption', message:'Water supply will be interrupted on June 9th from 10 AM to 2 PM due to maintenance work.', date:'2026-06-07', type:'warning', propId:'p1' },
  { id:'a2', title:'Community Game Night 🎮', message:'Join us for a fun game night in the common area on June 12th at 7 PM.', date:'2026-06-06', type:'event', propId:'p1' },
  { id:'a3', title:'WiFi Upgraded to 1 Gbps', message:'New network: HarmonyPG_5G. Password at reception.', date:'2026-06-03', type:'info', propId:'p1' },
];

export const foodMenu = {
  Monday:    { breakfast:'Idli Sambar + Coffee', lunch:'Rice + Dal + Sabzi + Roti', dinner:'Chapati + Paneer Curry + Rice' },
  Tuesday:   { breakfast:'Poha + Juice', lunch:'Rice + Rajma + Papad', dinner:'Dosa + Chutney + Sambar' },
  Wednesday: { breakfast:'Upma + Tea', lunch:'Fried Rice + Manchurian', dinner:'Roti + Mixed Veg + Dal' },
  Thursday:  { breakfast:'Bread Toast + Omelette', lunch:'Rice + Chole + Salad', dinner:'Pulao + Raita + Pickle' },
  Friday:    { breakfast:'Paratha + Curd', lunch:'Rice + Fish Curry + Dal', dinner:'Noodles + Soup' },
  Saturday:  { breakfast:'Puri + Bhaji', lunch:'Biryani + Raita + Shorba', dinner:'Rice + Dal Makhani + Sabzi' },
  Sunday:    { breakfast:'Masala Dosa + Filter Coffee', lunch:'Special Thali', dinner:'Chapati + Butter Chicken / Paneer' },
};

export const users = [
  { id:'u1', name:'Arjun Mehta', email:'arjun@gmail.com', role:'tenant', status:'Active', joined:'2025-01-15', kyc:'Verified', phone:'9876543210' },
  { id:'u2', name:'Sneha Patel', email:'sneha@gmail.com', role:'tenant', status:'Active', joined:'2025-03-01', kyc:'Verified', phone:'9876543211' },
  { id:'u3', name:'Rahul Singh', email:'rahul@gmail.com', role:'tenant', status:'Active', joined:'2025-02-10', kyc:'Pending', phone:'9876543212' },
  { id:'u4', name:'Rajesh Kumar', email:'rajesh@owner.com', role:'owner', status:'Active', joined:'2024-06-01', kyc:'Verified', phone:'9876543220' },
  { id:'u5', name:'Sunita Reddy', email:'sunita@owner.com', role:'owner', status:'Active', joined:'2024-08-15', kyc:'Verified', phone:'9876543221' },
  { id:'u6', name:'Kavya Reddy', email:'kavya@gmail.com', role:'tenant', status:'Pending', joined:'2026-06-01', kyc:'Pending', phone:'9876543214' },
];

export const kycQueue = [
  { id:'k1', userId:'u3', name:'Rahul Singh', type:'Aadhaar', submitted:'2026-06-06', status:'Pending', doc:'Aadhaar XXXX-XXXX-4512' },
  { id:'k2', userId:'u6', name:'Kavya Reddy', type:'PAN', submitted:'2026-06-07', status:'Pending', doc:'PAN ABCDE1234F' },
];

export const heroImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=85',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=85',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=85',
];
