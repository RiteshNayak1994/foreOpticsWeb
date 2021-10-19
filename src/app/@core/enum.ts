export enum Entity {
    Tenants = 1,
    Users = 2,
    Leads = 3,
    Prospects = 4,
    Accounts = 5,
    Contacts = 6,
    Products = 7,
    Orders = 8,
    Notes = 9,
    Tasks = 10,
    Events = 11,
    Files = 12,
    EntityStageTaskTransitions = 13,
    Resellers = 14,
    EmployerContributions = 15
}

export enum NoteType {
    LogACall = 1,
    Note = 2
}

export class ReferenceType {
    id: number;
    refType: string;
    name: string;
    intValue1: number;
    intValue2: string;
    strValue1: string;
    strValue2: string;
}

export enum InternalRoleRefType {
    Administrator = 1,
    Manager = 2,
    WarrantyTeam = 3,
    ProductsTeam = 4,
    InsdeRep = 5,
    OutsideRep = 6,
    Dealer = 7,
    OrderFullfilmentRep = 8,
    MarketingTeam = 9,
    SalesTeam = 10,
    Customer = 11,
    Accounting = 12
}
export enum TaskType {
    Call = 1,
    Email = 2,
    Voicemail = 3,
    FollowUp = 4,
    DataCorrection = 5
}

export enum EntityTimespan {
    AllTime = 1,
    Today = 2,
    ThisWeek = 3,
    Last7Days = 4,
    Last30Days = 5,
    ThisMonth = 6
}
export enum AppointmentTimespan {
    AllTime = 1,
    Last7Days = 2,
    Next7Days = 3,
    Last30Days = 4
}
export enum ContactType {
    Buyer = 1,
    Supplier = 2,
}
export enum RelationType {
    Self = 1,
    Spouse = 2,
    Child = 3,
    PrimaryCarePhysician = 4,
    Caregiver = 5,
    CareCoordinator = 6,

}
export enum AccountType {
    General = 1,
    JVPartner = 2,
    Lender = 3,
    Title = 4,
    PropertyManagement = 5,
    IRA1031Exchange = 6,
    Seller = 7,
    InsuranceAgent = 8,
    PropertyInspector = 9,
    Employer = 10,
    ProspectEmployer = 8
}

export enum ActivityTimespan {
    LAST7DAYS = 'LAST7DAYS',
    NEXT7DAYS = 'NEXT7DAYS',
    LAST30DAYS = 'LAST30DAYS',
    ALLTIME = 'ALLTIME'
}

export enum OrderStatus {
    Active = 1,
    Archived = 2,
    Canceled = 3
}

export enum OrderStage {
    New = 11,
    ExecutedContract = 12,
    Appraisal = 13,
    Underwriting = 14,
    ClearClose = 15,
    Closed = 16,
    Canceled = 17,
    OnHold = 18,
    Rehab = 19
}
export enum RefType {
    EntityTimespan='EntityTimespan', 
    ContactType='ContactType',
    CaseTypes='CaseTypes',
    CaseStatus='CaseStatus',
    CaseSources='CaseSources',
    RelationTypes='RelationTypes',
    WidgetTimespan='WidgetTimespan',
    TagShapes='TagShapes',
    TaskType='TaskType',
    TaskStatus='TaskStatus',
    FinanceType='FinanceType',
    ActivityTimespan='ActivityTimespan',
    ProductDisposition='ProductDisposition',
    ProductScope='ProductScope',
    CommissionRoleType='CommissionRoleType',
    EventStatus='EventStatus',
    InternalRole='InternalRole',
    EntityRequest='EntityRequest',
    EntityRequestStatus='EntityRequestStatus',
    HealthcareConsultant='AccountExt - Healthcare Consultant',
    EnrollmentSpecialist='AccountExt - Enrollment Specialist'
}
export enum CommissionRoleType {
    Setter = 1,
    Sales = 2,
    ReferralAgent = 3,
    ACQAgent = 4,
    JVPartner = 5
}

export enum CommissionPaymentMode {
    Cheque = 1,
    CreditDebitCard = 2,
    BankTransfer = 3
}

export enum Wizard {
    Investor = 1,
    Racheal = 3
}

export enum ProductDisposition {
    Available = 1,
    Reserved = 2,
    Sold = 3,
    Hidden = 4,
    Review = 5,
    Ordered = 6
}

export enum EventStatus {
    Pending = 1,
    Completed = 2,
    Canceled = 3,
    NotSure = 4,
    Rescheduled = 5
}

export enum TaskStatus {
    Pending = 1,
    Started = 2,
    Completed = 3,
    Canceled = 4
}

export enum DurationTimespan {
    LASTWEEK = 'LASTWEEK',
    LAST4WEEKS = 'LAST4WEEKS',
    LAST30DAYS = 'LAST4WEEKS',
    THISMONTH = 'THISMONTH',
    LASTMONTH = 'LASTMONTH',
    THISYEAR = 'THISYEAR'
}

export enum ProductInventoryType {
    Existing = 'Existing',
    PreConstruction = 'Pre-Construction',
    Rehab = 'Rehab'
}

export enum AccountTypes {
    Broker = 1,
    Franchise = 2,
    Association = 3,
    CPA = 4,
    Influencer = 5,
    CompanyProspect = 6,
    RDHEmployee = 7,
    ProspectEmployer = 8,
    Group = 9,
    Employer = 10
}

export enum EmployeeClass {
    EmployeeOnly = 1,
    EmployeeAndSpouse = 2,
    EmployeeAndChildren = 3,
    Family = 4,
}

export enum EntityStage {
    D = 32,
    C = 33,
    B = 34,
    A = 35,
    CloseWon = 37,
    CloseLost = 36,
}

export enum LeadSources {
    Web = 1,
    Website = 2,
    Facebook = 3,
    Phone_Inquiry = 4,
    Phone_Referer = 5,
    Purchased_List = 6,
    Other = 7,
    Money_Revealed = 9,
    JV_Chris_Miles = 10
}

export enum EntityTypes {
    Products = 8,
    Leads = 13
}
export enum OrderType {
    Order = 1,
    RAOrder = 2,
    TransferOrder = 3
}
export enum Warehouse {
    US = 1,
    German = 2,
    Taiwan = 3
}

export enum AddressType {
    BILLING = 1,
    SHIPPING = 2,
}

export enum EntityWorkFlow {
    DEFAULT,
    RA_ORDER,
    TRANSFER_ORDER
}