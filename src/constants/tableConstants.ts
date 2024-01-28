export const tableBrandHeadings = [
  { label: "S.No", sort: false },
  {
    label: "Onboarding Date",
    name: "dateOfJoining",
    sort: true,
    sortKey: "dateOfJoining",
  },
  { label: "SPOC Name", name: "spocName", sort: true, sortKey: "spocName" },
  { label: "Brand Name", name: "brandName", sort: true, sortKey: "brandName" },
  { label: "Mobile", name: "mobile", sort: true, sortKey: "mobile" },
  { label: "Email ID", name: "email", sort: true, sortKey: "email" },
  { label: "Category", name: "categories", 
  // sort: true,
   sortKey: "categories",
   icon: true 
  },
  { label: "Action", name: "action", sort: false },
];


export const tableProjectsHeadings = [
  { label: "S.No", sort: false },
  { label: "Created Date", name: "dateOfCreation", sort: false },
  { label: "Name", name: "projectName", sort: true, sortKey: "projectName" },
  { label: "Brand Name", name: "brand", sort: true, sortKey: "brand" },
  { label: "SOW", name: "sow", sort: false },
  { label: "Influencers Assigned", name: "influencersAssigned", sort: false },
  { label: "Subscription", name: "subscription", sort: false },
  { label: "Category", name: "categories", 
  // sort: true,
   sortKey: "categories",
   icon: true 
  },
  { label: "Status", name: "status", 
  sort: true,
  sortKey: "status",
  //  icon: true 
  },
  { label: "Action", name: "action", sort: false },
];


export const tableInfluencersHeadings = [
  { label: "S.No", sort: false },
  { label: "Name", name: "name", sort: false },
  { label: "Email Address", name: "email", sort: false },
  { label: "Mobile Number", name: "mobile", sort: false },
  { label: "Category", name: "categories", sort: false },
  { label: "Instagram", name: "instagram", sort: false },
  { label: "Facebook", name: "facebook", sort: false },
  { label: "Youtube", name: "youtube", sort: false },
  { label: "Twitter", name: "twitter", sort: false },
  { label: "Status", name: "status", sort: false },
  { label: "Action", name: "action", sort: false },
];


export const tableReportHeadings = [
  "Onboarding Date",
  "Name",
  "Mobile",
  "Email ID",
  "Category",
];

export const tableReportProjectsHeadings = [
  { label: "S.No" },
  { label: "Created Date", name: "dateOfCreation" },
  {
    label: "Project Name",
    name: "projectName",
    sort: true,
    sortKey: "projectName",
  },
  { label: "SOW", name: "sow" },
  { label: "Influencers Assigned", name: "influencersAssigned" },
  { label: "Subscription", name: "subscription" },
  { label: "Category", name: "categories", 
  // sort: true,
   sortKey: "categories",
   icon: true 
  },
  {
    label: "Status",
    name: "status",
    sort: true,
    sortKey: "status",
    // icon: true
  },
];

  export const tasksTableHeadings = [
    { label: "S.No" },
    {
      label: "Brand",
      name: "brand",
      sort: true,
      sortKey: "brandName",
      // icon: true,
    },
    { label: "Project", name: "project" },
    {
      label: "Influencer",
      name: "influencers",
      sort: true,
      sortKey: "influencers",
    },
    { label: "Task Name", name: "taskName", sort: true, sortKey: "taskName" },
    { label: "Description", name: "description" },
    { label: "Due Date", name: "dueDate", sort: true, sortKey: "dueDate" },
    {
      label: "Progress",
      name: "progress",
      sort: true,
      sortKey: "progress",
      //  icon: true
    },
  ];

export const paymentsTableHeadings = [
  { label: "S.No" },
  { label: "Brand", name: "brand", sort: true, sortKey: "brandName" },
  // icon: true,},
  { label: "Project", name: "project" },
  {
    label: "Influencer",
    name: "influencers",
    sort: true,
    sortKey: "influencers",
  },
  { label: "Task Name", name: "taskName", sort: true, sortKey: "taskName" },
  { label: "Description", name: "description" },
  { label: "Due Date", name: "dueDate", sort: true, sortKey: "dueDate" },
  {
    label: "Payment Status",
    name: "paymentStatus",
    sort: true,
    sortKey: "paymentStatus",
  },
  { label: "Method", name: "method", sort: true, sortKey: "method" },
  { label: "Amount", name: "amount" },
  // { label: "Info", name: "info" },
];

export const paymentsTableDummybody = [
  {
    brand: {
      brandName: "Brand A",
      mobile: "1234567890",
    },
    project: {
      projectName: "Project 1",
      email: "dummy@gmail.com",
    },
    influencers: [
      {
        influencer: "Influencer 1",
        tasks: [
          {
            taskName: "Task 1",
            description: "Description 1",
            dueDate: "2023-09-30",
            progress: "Completed",
            paymentStatus: "Paid",
            method: "Cash",
            amount: "1000",
          },
          {
            taskName: "Task 2",
            description: "Description 2",
            dueDate: "2023-10-15",
            progress: "In Progress",
            paymentStatus: "Due",
            method: "Cash",
            amount: "1000",
          },
        ],
      },
      {
        influencer: "Influencer 2",
        tasks: [
          {
            taskName: "Task 3",
            description: "Description 3",
            dueDate: "2023-10-10",
            progress: "To Do",
            paymentStatus: "Due",
            method: "Cash",
            amount: "1000",
          },
        ],
      },
    ],
  },
  {
    brand: {
      brandName: "Brand A",
      mobile: "1234567890",
    },
    project: {
      projectName: "Project 1",
      email: "dummy@gmail.com",
    },
    influencers: [
      {
        influencer: "Influencer 1",
        tasks: [
          {
            taskName: "Task 1",
            description: "Description 1",
            dueDate: "2023-09-30",
            progress: "Completed",
            paymentStatus: "Paid",
            method: "Cash",
            amount: "1000",
          },
          {
            taskName: "Task 2",
            description: "Description 2",
            dueDate: "2023-10-15",
            progress: "In Progress",
            paymentStatus: "Due",
            method: "Voucher",
            amount: "1200",
          },
        ],
      },
      {
        influencer: "Influencer 2",
        tasks: [
          {
            taskName: "Task 3",
            description: "Description 3",
            dueDate: "2023-10-10",
            progress: "To Do",
            paymentStatus: "Due",
            method: "Voucher",
            amount: "1200",
          },
          {
            taskName: "Task 3",
            description: "Description 3",
            dueDate: "2023-10-10",
            progress: "To Do",
            paymentStatus: "In Progress",
            method: "Voucher",
            amount: "1200",
          },
          {
            taskName: "Task 3",
            description: "Description 3",
            dueDate: "2023-10-10",
            progress: "To Do",
            paymentStatus: "Dispute",
            method: "Voucher",
            amount: "1200",
          },
          {
            taskName: "Task 3",
            description: "Description 3",
            dueDate: "2023-10-10",
            progress: "To Do",
            paymentStatus: "Due",
            method: "Voucher",
            amount: "1200",
          },
        ],
      },
    ],
  },
];
export const paymentStatus = ["Due", "In Progress", "Paid", "Dispute"];
