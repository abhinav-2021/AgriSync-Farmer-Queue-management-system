import type { Booking, Farmer, MandiCenter, DailyProcurementData, StateHierarchy } from '../types';

export const MOCK_FARMERS: Farmer[] = [
  {
    id: 'f-1',
    name: 'Balwinder Singh',
    phone: '9876543210',
    village: 'Rampur, Karnal',
    aadhaar_last4: '4392',
    state: 'Haryana',
    land_hectares: 4.5,
    total_procured_qtl: 145
  },
  {
    id: 'f-2',
    name: 'Ramesh Kumar Patel',
    phone: '9812345678',
    village: 'Kalyanpur, Sirsa',
    aadhaar_last4: '8821',
    state: 'Haryana',
    land_hectares: 3.2,
    total_procured_qtl: 110
  },
  {
    id: 'f-3',
    name: 'Sunita Devi',
    phone: '9898989898',
    village: 'Bishanpur, Kurukshetra',
    aadhaar_last4: '1094',
    state: 'Haryana',
    land_hectares: 2.8,
    total_procured_qtl: 85
  },
  {
    id: 'f-4',
    name: 'Harpreet Kaur',
    phone: '9765432109',
    village: 'Shahabad, Ambala',
    aadhaar_last4: '5543',
    state: 'Punjab',
    land_hectares: 6.0,
    total_procured_qtl: 240
  },
  {
    id: 'f-5',
    name: 'Suresh Chandra',
    phone: '9845123456',
    village: 'Dhand, Kaithal',
    aadhaar_last4: '7729',
    state: 'Haryana',
    land_hectares: 3.5,
    total_procured_qtl: 95
  },
  {
    id: 'f-6',
    name: 'Shivpal Singh Yadav',
    phone: '9811223344',
    village: 'Panagar, Jabalpur',
    aadhaar_last4: '9912',
    state: 'Madhya Pradesh',
    land_hectares: 5.2,
    total_procured_qtl: 180
  },
  {
    id: 'f-7',
    name: 'Ramakant Jha',
    phone: '9822334455',
    village: 'Phulwari Sharif, Patna',
    aadhaar_last4: '6142',
    state: 'Bihar',
    land_hectares: 2.1,
    total_procured_qtl: 60
  },
  {
    id: 'f-8',
    name: 'Virendra Pratap Singh',
    phone: '9833445566',
    village: 'Fatehabad, Agra',
    aadhaar_last4: '3819',
    state: 'Uttar Pradesh',
    land_hectares: 4.0,
    total_procured_qtl: 130
  }
];

export const STATE_HIERARCHY: StateHierarchy[] = [
  {
    state: 'Haryana',
    districts: [
      {
        name: 'Karnal',
        mandis: [
          { id: 'm-1', name: 'Karnal Mandi', waitTimeMinutes: 120, status: 'critical', activeVehicles: 42, activeCounters: 6, headOperator: 'Anil Deshmukh (Inspector)' },
          { id: 'hr-kar-2', name: 'Gharaunda APMC', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 9, activeCounters: 4, headOperator: 'Mohan Lal (Officer)' },
          { id: 'hr-kar-3', name: 'Assandh Mandi Yard', waitTimeMinutes: 35, status: 'warning', activeVehicles: 12, activeCounters: 3, headOperator: 'Sohan Sandhu (Supervisor)' }
        ]
      },
      {
        name: 'Sirsa',
        mandis: [
          { id: 'm-3', name: 'Sirsa Mandi', waitTimeMinutes: 10, status: 'optimal', activeVehicles: 4, activeCounters: 5, headOperator: 'Pritam Singh (Supervisor)' },
          { id: 'hr-sir-2', name: 'Mandi Dabwali APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 6, activeCounters: 4, headOperator: 'Gurjit Dhillon (Officer)' }
        ]
      },
      {
        name: 'Kurukshetra',
        mandis: [
          { id: 'm-6', name: 'Kurukshetra Mandi', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 6, activeCounters: 5, headOperator: 'Devendra Yadav (Inspector)' },
          { id: 'hr-kur-2', name: 'Shahabad Markanda Mandi', waitTimeMinutes: 30, status: 'optimal', activeVehicles: 10, activeCounters: 4, headOperator: 'Jasbir Cheema (Supervisor)' },
          { id: 'hr-kur-3', name: 'Pehowa APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Jagtar Singh (Inspector)' }
        ]
      },
      {
        name: 'Rohtak',
        mandis: [
          { id: 'm-2', name: 'Rohtak Mandi', waitTimeMinutes: 45, status: 'warning', activeVehicles: 18, activeCounters: 4, headOperator: 'Ravi Teja (Superintendent)' },
          { id: 'hr-roh-2', name: 'Meham APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Mukesh Dahiya (Supervisor)' }
        ]
      },
      {
        name: 'Ambala',
        mandis: [
          { id: 'm-4', name: 'Ambala Mandi', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 8, activeCounters: 4, headOperator: 'Jaswant Singh (Officer)' },
          { id: 'hr-amb-2', name: 'Barara APMC', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 5, activeCounters: 3, headOperator: 'Surjit Kumar (Supervisor)' }
        ]
      },
      {
        name: 'Kaithal',
        mandis: [
          { id: 'm-5', name: 'Kaithal Mandi', waitTimeMinutes: 35, status: 'warning', activeVehicles: 14, activeCounters: 4, headOperator: 'Manoj Kumar (Supervisor)' },
          { id: 'hr-kai-2', name: 'Cheeka Grain Market', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 8, activeCounters: 3, headOperator: 'Satpal Malik (Officer)' }
        ]
      },
      {
        name: 'Hisar',
        mandis: [
          { id: 'm-7', name: 'Hisar Mandi', waitTimeMinutes: 50, status: 'warning', activeVehicles: 22, activeCounters: 6, headOperator: 'Rajesh Varma (Superintendent)' },
          { id: 'hr-his-2', name: 'Hansi APMC', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 9, activeCounters: 4, headOperator: 'Om Prakash (Inspector)' }
        ]
      },
      {
        name: 'Jind',
        mandis: [
          { id: 'm-8', name: 'Jind Mandi', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Kuldeep Hooda (Officer)' },
          { id: 'hr-jin-2', name: 'Narwana APMC', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 5, activeCounters: 3, headOperator: 'Satish Punia (Supervisor)' }
        ]
      }
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      {
        name: 'Jabalpur',
        mandis: [
          { id: 'mp-jab-1', name: 'Jabalpur APMC (Main Mandi)', waitTimeMinutes: 60, status: 'warning', activeVehicles: 26, activeCounters: 5, headOperator: 'Rameshwar Tiwari (Inspector)' },
          { id: 'mp-jab-2', name: 'Sihora APMC', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 9, activeCounters: 4, headOperator: 'Kailash Patel (Supervisor)' },
          { id: 'mp-jab-3', name: 'Patan Mandi Yard', waitTimeMinutes: 35, status: 'warning', activeVehicles: 12, activeCounters: 3, headOperator: 'Vinod Soni (Officer)' }
        ]
      },
      {
        name: 'Bhopal',
        mandis: [
          { id: 'mp-bho-1', name: 'Bhopal Karond Mandi', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 8, activeCounters: 4, headOperator: 'Narendra Chouhan (Superintendent)' },
          { id: 'mp-bho-2', name: 'Berasia APMC', waitTimeMinutes: 40, status: 'warning', activeVehicles: 14, activeCounters: 3, headOperator: 'Dinesh Meena (Inspector)' }
        ]
      },
      {
        name: 'Indore',
        mandis: [
          { id: 'mp-ind-1', name: 'Indore Choithram Mandi', waitTimeMinutes: 75, status: 'critical', activeVehicles: 34, activeCounters: 6, headOperator: 'Vijay Joshi (Inspector)' },
          { id: 'mp-ind-2', name: 'Sanwer APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Gopal Verma (Supervisor)' }
        ]
      },
      {
        name: 'Ujjain',
        mandis: [
          { id: 'mp-ujj-1', name: 'Ujjain Krishi Upaj Mandi', waitTimeMinutes: 30, status: 'optimal', activeVehicles: 11, activeCounters: 4, headOperator: 'Deepak Shukla (Inspector)' },
          { id: 'mp-ujj-2', name: 'Mahidpur APMC', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 5, activeCounters: 3, headOperator: 'Sunil Gurjar (Supervisor)' }
        ]
      },
      {
        name: 'Narmadapuram',
        mandis: [
          { id: 'mp-hos-1', name: 'Itarsi APMC Yard', waitTimeMinutes: 45, status: 'warning', activeVehicles: 16, activeCounters: 4, headOperator: 'Satish Rai (Officer)' },
          { id: 'mp-hos-2', name: 'Pipariya Grain Mandi', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 8, activeCounters: 3, headOperator: 'Pawan Rajput (Supervisor)' }
        ]
      }
    ]
  },
  {
    state: 'Punjab',
    districts: [
      {
        name: 'Ludhiana',
        mandis: [
          { id: 'pb-lud-1', name: 'Khanna Grain Market (Asia\'s Largest)', waitTimeMinutes: 135, status: 'critical', activeVehicles: 48, activeCounters: 8, headOperator: 'Harpreet Singh (Chief Inspector)' },
          { id: 'pb-lud-2', name: 'Ludhiana New Grain Yard', waitTimeMinutes: 40, status: 'warning', activeVehicles: 17, activeCounters: 5, headOperator: 'Manjit Sandhu (Superintendent)' },
          { id: 'pb-lud-3', name: 'Jagraon Mandi', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 9, activeCounters: 4, headOperator: 'Sukhdev Grewal (Officer)' }
        ]
      },
      {
        name: 'Amritsar',
        mandis: [
          { id: 'pb-amr-1', name: 'Bhagtanwala Mandi', waitTimeMinutes: 55, status: 'warning', activeVehicles: 20, activeCounters: 5, headOperator: 'Tarlok Singh (Supervisor)' },
          { id: 'pb-amr-2', name: 'Rayya APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Amrik Gill (Officer)' }
        ]
      },
      {
        name: 'Patiala',
        mandis: [
          { id: 'pb-pat-1', name: 'Patiala Grain Yard', waitTimeMinutes: 30, status: 'optimal', activeVehicles: 11, activeCounters: 4, headOperator: 'Davinder Brar (Inspector)' },
          { id: 'pb-pat-2', name: 'Rajpura APMC', waitTimeMinutes: 45, status: 'warning', activeVehicles: 16, activeCounters: 4, headOperator: 'Baldev Sidhu (Supervisor)' }
        ]
      },
      {
        name: 'Bathinda',
        mandis: [
          { id: 'pb-bat-1', name: 'Bathinda Main Mandi', waitTimeMinutes: 35, status: 'warning', activeVehicles: 13, activeCounters: 4, headOperator: 'Karamjit Mann (Officer)' },
          { id: 'pb-bat-2', name: 'Rampura Phul APMC', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 6, activeCounters: 3, headOperator: 'Avtar Dhillon (Supervisor)' }
        ]
      }
    ]
  },
  {
    state: 'Bihar',
    districts: [
      {
        name: 'Patna',
        mandis: [
          { id: 'br-pat-1', name: 'Patna Bazar Samiti (Mussalahpur)', waitTimeMinutes: 55, status: 'warning', activeVehicles: 21, activeCounters: 4, headOperator: 'Ajay Kumar Sinha (Inspector)' },
          { id: 'br-pat-2', name: 'Fatuha APMC', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 8, activeCounters: 3, headOperator: 'Brijesh Pandey (Supervisor)' },
          { id: 'br-pat-3', name: 'Danapur Mandi Yard', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 6, activeCounters: 3, headOperator: 'Mukesh Sahay (Officer)' }
        ]
      },
      {
        name: 'Muzaffarpur',
        mandis: [
          { id: 'br-muz-1', name: 'Muzaffarpur Bazar Samiti', waitTimeMinutes: 40, status: 'warning', activeVehicles: 15, activeCounters: 4, headOperator: 'Ravi Ranjan (Inspector)' },
          { id: 'br-muz-2', name: 'Motipur Mandi', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Shambhu Nath (Supervisor)' }
        ]
      },
      {
        name: 'Purnia',
        mandis: [
          { id: 'br-pur-1', name: 'Gulabbagh Mandi (Maize Hub)', waitTimeMinutes: 80, status: 'critical', activeVehicles: 32, activeCounters: 5, headOperator: 'Manoj Kumar Jha (Superintendent)' },
          { id: 'br-pur-2', name: 'Kasba APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 6, activeCounters: 3, headOperator: 'Arun Bhagat (Officer)' }
        ]
      },
      {
        name: 'Begusarai',
        mandis: [
          { id: 'br-beg-1', name: 'Begusarai Bazar Samiti', waitTimeMinutes: 30, status: 'optimal', activeVehicles: 10, activeCounters: 3, headOperator: 'Alok Paswan (Supervisor)' },
          { id: 'br-beg-2', name: 'Bakhri Mandi Yard', waitTimeMinutes: 15, status: 'optimal', activeVehicles: 5, activeCounters: 2, headOperator: 'Krishna Murari (Officer)' }
        ]
      }
    ]
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      {
        name: 'Agra',
        mandis: [
          { id: 'up-agr-1', name: 'Agra Fatehabad Road Mandi', waitTimeMinutes: 50, status: 'warning', activeVehicles: 19, activeCounters: 5, headOperator: 'Ramendra Yadav (Inspector)' },
          { id: 'up-agr-2', name: 'Khandauli Potato & Grain Mandi', waitTimeMinutes: 30, status: 'optimal', activeVehicles: 10, activeCounters: 4, headOperator: 'Sanjay Kushwaha (Supervisor)' }
        ]
      },
      {
        name: 'Lucknow',
        mandis: [
          { id: 'up-luc-1', name: 'Lucknow Dubagga APMC', waitTimeMinutes: 65, status: 'critical', activeVehicles: 27, activeCounters: 5, headOperator: 'Abhay Pratap Singh (Superintendent)' },
          { id: 'up-luc-2', name: 'Mohanlalganj Mandi', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Dinesh Mishra (Officer)' }
        ]
      },
      {
        name: 'Varanasi',
        mandis: [
          { id: 'up-var-1', name: 'Varanasi Chandpur APMC', waitTimeMinutes: 45, status: 'warning', activeVehicles: 16, activeCounters: 4, headOperator: 'Gauri Shankar (Inspector)' },
          { id: 'up-var-2', name: 'Raja Talab Mandi', waitTimeMinutes: 25, status: 'optimal', activeVehicles: 8, activeCounters: 3, headOperator: 'Vikram Patel (Supervisor)' }
        ]
      },
      {
        name: 'Aligarh',
        mandis: [
          { id: 'up-ali-1', name: 'Aligarh Dhaniapur Grain Yard', waitTimeMinutes: 35, status: 'warning', activeVehicles: 13, activeCounters: 4, headOperator: 'Deepak Varshney (Supervisor)' },
          { id: 'up-ali-2', name: 'Khair APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 7, activeCounters: 3, headOperator: 'Rajendra Chaudhary (Officer)' }
        ]
      },
      {
        name: 'Meerut',
        mandis: [
          { id: 'up-mee-1', name: 'Meerut Delhi Road Mandi', waitTimeMinutes: 40, status: 'warning', activeVehicles: 15, activeCounters: 4, headOperator: 'Sudhir Tomar (Inspector)' },
          { id: 'up-mee-2', name: 'Sardhana APMC', waitTimeMinutes: 20, status: 'optimal', activeVehicles: 6, activeCounters: 3, headOperator: 'Brijesh Rathi (Supervisor)' }
        ]
      }
    ]
  }
];

export interface StateKpiData {
  mandisCount: string;
  mandisSubtext: string;
  farmersCount: string;
  farmersSubtext: string;
  procuredVolume: string;
  procuredSubtext: string;
  fundsDisbursed: string;
  fundsSubtext: string;
}

export const STATE_KPI_METRICS: Record<string, StateKpiData> = {
  all: {
    mandisCount: '689',
    mandisSubtext: 'Across 5 States (210 Districts) • 98.4% Operational',
    farmersCount: '232,450',
    farmersSubtext: '+8,920 enrolled this week nationwide',
    procuredVolume: '6.4M Qtl',
    procuredSubtext: 'Wheat, Paddy, Mustard, Maize & Cotton',
    fundsDisbursed: '₹11.8B',
    fundsSubtext: '100% direct DBT bank transfers active'
  },
  Haryana: {
    mandisCount: '142',
    mandisSubtext: 'Across 22 Districts • 98.6% Operational',
    farmersCount: '45,210',
    farmersSubtext: '+1,240 enrolled this week',
    procuredVolume: '1.2M Qtl',
    procuredSubtext: 'Wheat, Paddy, Mustard & Cotton',
    fundsDisbursed: '₹2.1B',
    fundsSubtext: 'HSAMB direct DBT bank transfer'
  },
  'Madhya Pradesh': {
    mandisCount: '128',
    mandisSubtext: 'Across 52 Districts • 97.8% Operational',
    farmersCount: '48,150',
    farmersSubtext: '+1,820 enrolled this week',
    procuredVolume: '1.4M Qtl',
    procuredSubtext: 'Wheat, Soyabean, Chana & Mustard',
    fundsDisbursed: '₹2.6B',
    fundsSubtext: 'MP e-Uparjan direct DBT payment'
  },
  Punjab: {
    mandisCount: '154',
    mandisSubtext: 'Across 23 Districts • 99.1% Operational',
    farmersCount: '58,900',
    farmersSubtext: '+2,340 enrolled this week',
    procuredVolume: '1.8M Qtl',
    procuredSubtext: 'Paddy & Wheat Heavy Procurement',
    fundsDisbursed: '₹3.4B',
    fundsSubtext: 'Punjab Mandi Board instant DBT'
  },
  Bihar: {
    mandisCount: '85',
    mandisSubtext: 'Across 38 Districts • 96.2% Operational',
    farmersCount: '22,400',
    farmersSubtext: '+980 enrolled this week',
    procuredVolume: '0.5M Qtl',
    procuredSubtext: 'Maize, Paddy & Pulses Hub',
    fundsDisbursed: '₹0.9B',
    fundsSubtext: 'PACS / State Food Corp DBT transfer'
  },
  'Uttar Pradesh': {
    mandisCount: '180',
    mandisSubtext: 'Across 75 Districts • 97.5% Operational',
    farmersCount: '67,800',
    farmersSubtext: '+2,540 enrolled this week',
    procuredVolume: '1.5M Qtl',
    procuredSubtext: 'Wheat, Paddy, Sugarcane & Mustard',
    fundsDisbursed: '₹2.8B',
    fundsSubtext: 'UP Mandi Parishad direct DBT'
  }
};

export const MOCK_MANDIS: MandiCenter[] = [
  // Haryana
  {
    id: 'm-1',
    name: 'Karnal Mandi',
    district: 'Karnal',
    state: 'Haryana',
    status: 'critical',
    waitTimeMinutes: 120,
    activeVehicles: 42,
    activeCounters: 6,
    todayQuintals: 14200,
    dailyCapacity: 15000,
    headOperator: 'Anil Deshmukh (Inspector)'
  },
  {
    id: 'm-2',
    name: 'Rohtak Mandi',
    district: 'Rohtak',
    state: 'Haryana',
    status: 'warning',
    waitTimeMinutes: 45,
    activeVehicles: 18,
    activeCounters: 4,
    todayQuintals: 9800,
    dailyCapacity: 12000,
    headOperator: 'Ravi Teja (Superintendent)'
  },
  {
    id: 'm-3',
    name: 'Sirsa Mandi',
    district: 'Sirsa',
    state: 'Haryana',
    status: 'optimal',
    waitTimeMinutes: 10,
    activeVehicles: 4,
    activeCounters: 5,
    todayQuintals: 16500,
    dailyCapacity: 20000,
    headOperator: 'Pritam Singh (Supervisor)'
  },
  {
    id: 'm-4',
    name: 'Ambala Mandi',
    district: 'Ambala',
    state: 'Haryana',
    status: 'optimal',
    waitTimeMinutes: 25,
    activeVehicles: 8,
    activeCounters: 4,
    todayQuintals: 8900,
    dailyCapacity: 11000,
    headOperator: 'Jaswant Singh (Officer)'
  },
  {
    id: 'm-5',
    name: 'Kaithal Mandi',
    district: 'Kaithal',
    state: 'Haryana',
    status: 'warning',
    waitTimeMinutes: 35,
    activeVehicles: 14,
    activeCounters: 4,
    todayQuintals: 11200,
    dailyCapacity: 13000,
    headOperator: 'Manoj Kumar (Supervisor)'
  },
  {
    id: 'm-6',
    name: 'Kurukshetra Mandi',
    district: 'Kurukshetra',
    state: 'Haryana',
    status: 'optimal',
    waitTimeMinutes: 15,
    activeVehicles: 6,
    activeCounters: 5,
    todayQuintals: 13400,
    dailyCapacity: 16000,
    headOperator: 'Devendra Yadav (Inspector)'
  },
  {
    id: 'm-7',
    name: 'Hisar Mandi',
    district: 'Hisar',
    state: 'Haryana',
    status: 'warning',
    waitTimeMinutes: 50,
    activeVehicles: 22,
    activeCounters: 6,
    todayQuintals: 18100,
    dailyCapacity: 19000,
    headOperator: 'Rajesh Varma (Superintendent)'
  },
  {
    id: 'm-8',
    name: 'Jind Mandi',
    district: 'Jind',
    state: 'Haryana',
    status: 'optimal',
    waitTimeMinutes: 20,
    activeVehicles: 7,
    activeCounters: 3,
    todayQuintals: 7600,
    dailyCapacity: 10000,
    headOperator: 'Kuldeep Hooda (Officer)'
  },
  // Madhya Pradesh
  {
    id: 'mp-jab-1',
    name: 'Jabalpur APMC',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    status: 'warning',
    waitTimeMinutes: 60,
    activeVehicles: 26,
    activeCounters: 5,
    todayQuintals: 15200,
    dailyCapacity: 18000,
    headOperator: 'Rameshwar Tiwari (Inspector)'
  },
  {
    id: 'mp-jab-2',
    name: 'Sihora APMC',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    status: 'optimal',
    waitTimeMinutes: 25,
    activeVehicles: 9,
    activeCounters: 4,
    todayQuintals: 8400,
    dailyCapacity: 11000,
    headOperator: 'Kailash Patel (Supervisor)'
  },
  {
    id: 'mp-bho-1',
    name: 'Bhopal Karond Mandi',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    status: 'optimal',
    waitTimeMinutes: 15,
    activeVehicles: 8,
    activeCounters: 4,
    todayQuintals: 9600,
    dailyCapacity: 12500,
    headOperator: 'Narendra Chouhan (Superintendent)'
  },
  {
    id: 'mp-ind-1',
    name: 'Indore Choithram Mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    status: 'critical',
    waitTimeMinutes: 75,
    activeVehicles: 34,
    activeCounters: 6,
    todayQuintals: 21500,
    dailyCapacity: 22000,
    headOperator: 'Vijay Joshi (Inspector)'
  },
  {
    id: 'mp-ujj-1',
    name: 'Ujjain Krishi Upaj Mandi',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    status: 'optimal',
    waitTimeMinutes: 30,
    activeVehicles: 11,
    activeCounters: 4,
    todayQuintals: 12800,
    dailyCapacity: 15000,
    headOperator: 'Deepak Shukla (Inspector)'
  },
  // Punjab
  {
    id: 'pb-lud-1',
    name: 'Khanna Grain Market (Asia\'s Largest)',
    district: 'Ludhiana',
    state: 'Punjab',
    status: 'critical',
    waitTimeMinutes: 135,
    activeVehicles: 48,
    activeCounters: 8,
    todayQuintals: 28400,
    dailyCapacity: 30000,
    headOperator: 'Harpreet Singh (Chief Inspector)'
  },
  {
    id: 'pb-amr-1',
    name: 'Bhagtanwala Mandi',
    district: 'Amritsar',
    state: 'Punjab',
    status: 'warning',
    waitTimeMinutes: 55,
    activeVehicles: 20,
    activeCounters: 5,
    todayQuintals: 14600,
    dailyCapacity: 17000,
    headOperator: 'Tarlok Singh (Supervisor)'
  },
  {
    id: 'pb-pat-1',
    name: 'Patiala Grain Yard',
    district: 'Patiala',
    state: 'Punjab',
    status: 'optimal',
    waitTimeMinutes: 30,
    activeVehicles: 11,
    activeCounters: 4,
    todayQuintals: 13100,
    dailyCapacity: 16000,
    headOperator: 'Davinder Brar (Inspector)'
  },
  {
    id: 'pb-bat-1',
    name: 'Bathinda Main Mandi',
    district: 'Bathinda',
    state: 'Punjab',
    status: 'warning',
    waitTimeMinutes: 35,
    activeVehicles: 13,
    activeCounters: 4,
    todayQuintals: 11900,
    dailyCapacity: 14000,
    headOperator: 'Karamjit Mann (Officer)'
  },
  // Bihar
  {
    id: 'br-pat-1',
    name: 'Patna Bazar Samiti',
    district: 'Patna',
    state: 'Bihar',
    status: 'warning',
    waitTimeMinutes: 55,
    activeVehicles: 21,
    activeCounters: 4,
    todayQuintals: 10800,
    dailyCapacity: 13000,
    headOperator: 'Ajay Kumar Sinha (Inspector)'
  },
  {
    id: 'br-pur-1',
    name: 'Gulabbagh Mandi (Maize Hub)',
    district: 'Purnia',
    state: 'Bihar',
    status: 'critical',
    waitTimeMinutes: 80,
    activeVehicles: 32,
    activeCounters: 5,
    todayQuintals: 19400,
    dailyCapacity: 20000,
    headOperator: 'Manoj Kumar Jha (Superintendent)'
  },
  {
    id: 'br-muz-1',
    name: 'Muzaffarpur Bazar Samiti',
    district: 'Muzaffarpur',
    state: 'Bihar',
    status: 'warning',
    waitTimeMinutes: 40,
    activeVehicles: 15,
    activeCounters: 4,
    todayQuintals: 9200,
    dailyCapacity: 12000,
    headOperator: 'Ravi Ranjan (Inspector)'
  },
  {
    id: 'br-beg-1',
    name: 'Begusarai Bazar Samiti',
    district: 'Begusarai',
    state: 'Bihar',
    status: 'optimal',
    waitTimeMinutes: 30,
    activeVehicles: 10,
    activeCounters: 3,
    todayQuintals: 7400,
    dailyCapacity: 9500,
    headOperator: 'Alok Paswan (Supervisor)'
  },
  // Uttar Pradesh
  {
    id: 'up-luc-1',
    name: 'Lucknow Dubagga APMC',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    status: 'critical',
    waitTimeMinutes: 65,
    activeVehicles: 27,
    activeCounters: 5,
    todayQuintals: 16800,
    dailyCapacity: 18000,
    headOperator: 'Abhay Pratap Singh (Superintendent)'
  },
  {
    id: 'up-agr-1',
    name: 'Agra Fatehabad Road Mandi',
    district: 'Agra',
    state: 'Uttar Pradesh',
    status: 'warning',
    waitTimeMinutes: 50,
    activeVehicles: 19,
    activeCounters: 5,
    todayQuintals: 14100,
    dailyCapacity: 16500,
    headOperator: 'Ramendra Yadav (Inspector)'
  },
  {
    id: 'up-var-1',
    name: 'Varanasi Chandpur APMC',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    status: 'warning',
    waitTimeMinutes: 45,
    activeVehicles: 16,
    activeCounters: 4,
    todayQuintals: 12300,
    dailyCapacity: 15000,
    headOperator: 'Gauri Shankar (Inspector)'
  },
  {
    id: 'up-ali-1',
    name: 'Aligarh Dhaniapur Grain Yard',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    status: 'warning',
    waitTimeMinutes: 35,
    activeVehicles: 13,
    activeCounters: 4,
    todayQuintals: 10400,
    dailyCapacity: 13000,
    headOperator: 'Deepak Varshney (Supervisor)'
  },
  {
    id: 'up-mee-1',
    name: 'Meerut Delhi Road Mandi',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    status: 'optimal',
    waitTimeMinutes: 20,
    activeVehicles: 7,
    activeCounters: 4,
    todayQuintals: 8700,
    dailyCapacity: 11500,
    headOperator: 'Sudhir Tomar (Inspector)'
  }
];

export const MOCK_7DAY_PROCUREMENT: DailyProcurementData[] = [
  { day: 'Wed', date: 'Aug 26', volumeK: 145, payoutCr: 29.0, wheatK: 90, paddyK: 35, mustardK: 20 },
  { day: 'Thu', date: 'Aug 27', volumeK: 168, payoutCr: 33.6, wheatK: 105, paddyK: 40, mustardK: 23 },
  { day: 'Fri', date: 'Aug 28', volumeK: 192, payoutCr: 38.4, wheatK: 120, paddyK: 46, mustardK: 26 },
  { day: 'Sat', date: 'Aug 29', volumeK: 215, payoutCr: 43.0, wheatK: 135, paddyK: 52, mustardK: 28 }, // Peak
  { day: 'Sun', date: 'Aug 30', volumeK: 174, payoutCr: 34.8, wheatK: 110, paddyK: 42, mustardK: 22 },
  { day: 'Mon', date: 'Aug 31', volumeK: 188, payoutCr: 37.6, wheatK: 118, paddyK: 45, mustardK: 25 },
  { day: 'Tue', date: 'Sep 01', volumeK: 195, payoutCr: 39.0, wheatK: 122, paddyK: 48, mustardK: 25 }  // Today
];

export const MOCK_OPERATORS = [
  { id: 'op-1', name: 'Devendra Yadav', role: 'Gate Verification', center: 'Karnal Mandi', status: 'active', tokensProcessed: 68 },
  { id: 'op-2', name: 'Anil Deshmukh', role: 'Moisture Testing Lab', center: 'Karnal Mandi', status: 'active', tokensProcessed: 54 },
  { id: 'op-3', name: 'Sunil Malik', role: 'Electronic Weighbridge', center: 'Karnal Mandi', status: 'active', tokensProcessed: 61 },
  { id: 'op-4', name: 'Virender Phogat', role: 'DBT Payment Disbursal', center: 'Karnal Mandi', status: 'active', tokensProcessed: 49 },
  { id: 'op-5', name: 'Jaswant Singh', role: 'Gate Verification', center: 'Ambala Mandi', status: 'active', tokensProcessed: 42 },
  { id: 'op-6', name: 'Ravi Teja', role: 'Moisture Testing Lab', center: 'Rohtak Mandi', status: 'active', tokensProcessed: 38 },
  { id: 'op-7', name: 'Pritam Singh', role: 'Electronic Weighbridge', center: 'Sirsa Mandi', status: 'active', tokensProcessed: 72 }
];

const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    farmer_id: 'f-2',
    farmer_name: 'Ramesh Kumar Patel',
    farmer_phone: '9812345678',
    farmer_village: 'Kalyanpur, Sirsa',
    token_number: 'A-101',
    crop_type: 'Wheat (गेहूं)',
    estimated_quintals: 65,
    vehicle_type: 'Tractor-Trolley',
    vehicle_number: 'HR-24-B-4412',
    slot_date: todayStr,
    slot_time: '08:00 AM - 09:00 AM',
    status: 'paid',
    counter_assigned: 'Counter 3 - Accounts DBT',
    moisture_percentage: 11.2,
    actual_weight_quintals: 64.8,
    msp_rate_per_quintal: 2275,
    total_payout: 147420,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    stage_timestamps: {
      registered_at: '08:05 AM',
      verified_at: '08:25 AM',
      weighed_at: '08:50 AM',
      paid_at: '09:15 AM',
    }
  },
  {
    id: 'b-102',
    farmer_id: 'f-4',
    farmer_name: 'Harpreet Kaur',
    farmer_phone: '9765432109',
    farmer_village: 'Shahabad, Ambala',
    token_number: 'A-102',
    crop_type: 'Paddy (धान)',
    estimated_quintals: 90,
    vehicle_type: 'Heavy Truck',
    vehicle_number: 'PB-11-K-9008',
    slot_date: todayStr,
    slot_time: '09:00 AM - 10:00 AM',
    status: 'weighed',
    counter_assigned: 'Weighbridge 1',
    moisture_percentage: 12.8,
    actual_weight_quintals: 88.5,
    msp_rate_per_quintal: 2183,
    total_payout: 193195,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    stage_timestamps: {
      registered_at: '09:02 AM',
      verified_at: '09:22 AM',
      weighed_at: '09:44 AM'
    }
  },
  {
    id: 'b-103',
    farmer_id: 'f-3',
    farmer_name: 'Sunita Devi',
    farmer_phone: '9898989898',
    farmer_village: 'Bishanpur, Kurukshetra',
    token_number: 'A-103',
    crop_type: 'Mustard (सरसों)',
    estimated_quintals: 40,
    vehicle_type: 'Mini-Truck',
    vehicle_number: 'HR-07-C-1982',
    slot_date: todayStr,
    slot_time: '09:00 AM - 10:00 AM',
    status: 'verified',
    counter_assigned: 'Quality Lab 2',
    moisture_percentage: 7.9,
    actual_weight_quintals: 41.2,
    msp_rate_per_quintal: 5650,
    total_payout: 232780,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    stage_timestamps: {
      registered_at: '09:12 AM',
      verified_at: '09:35 AM'
    }
  },
  {
    id: 'b-104',
    farmer_id: 'f-1',
    farmer_name: 'Balwinder Singh',
    farmer_phone: '9876543210',
    farmer_village: 'Rampur, Karnal',
    token_number: 'A-104',
    crop_type: 'Wheat (गेहूं)',
    estimated_quintals: 55,
    vehicle_type: 'Tractor-Trolley',
    vehicle_number: 'HR-05-X-6731',
    slot_date: todayStr,
    slot_time: '10:00 AM - 11:00 AM',
    status: 'registered',
    counter_assigned: 'Gate Entry 1',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    stage_timestamps: {
      registered_at: '10:02 AM'
    }
  },
  {
    id: 'b-105',
    farmer_id: 'f-5',
    farmer_name: 'Suresh Chandra',
    farmer_phone: '9845123456',
    farmer_village: 'Dhand, Kaithal',
    token_number: 'A-105',
    crop_type: 'Cotton (कपास)',
    estimated_quintals: 30,
    vehicle_type: 'Tractor-Trolley',
    vehicle_number: 'HR-08-T-2201',
    slot_date: todayStr,
    slot_time: '10:00 AM - 11:00 AM',
    status: 'registered',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    stage_timestamps: {
      registered_at: '10:15 AM'
    }
  },
  {
    id: 'b-106',
    farmer_id: 'f-1',
    farmer_name: 'Balwinder Singh',
    farmer_phone: '9876543210',
    farmer_village: 'Rampur, Karnal',
    token_number: 'A-106',
    crop_type: 'Mustard (सरसों)',
    estimated_quintals: 25,
    vehicle_type: 'Tractor-Trolley',
    vehicle_number: 'HR-05-X-6731',
    slot_date: todayStr,
    slot_time: '11:00 AM - 12:00 PM',
    status: 'registered',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    stage_timestamps: {
      registered_at: '10:30 AM'
    }
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM'
];

export const CROPS = [
  { name: 'Wheat (गेहूं)', msp: 2275, moistureLimit: '12%' },
  { name: 'Paddy (धान)', msp: 2183, moistureLimit: '14%' },
  { name: 'Mustard (सरसों)', msp: 5650, moistureLimit: '8%' },
  { name: 'Cotton (कपास)', msp: 6620, moistureLimit: '8%' },
  { name: 'Maize (मक्का)', msp: 2090, moistureLimit: '14%' },
  { name: 'Soyabean (सोयाबीन)', msp: 4600, moistureLimit: '12%' }
];
