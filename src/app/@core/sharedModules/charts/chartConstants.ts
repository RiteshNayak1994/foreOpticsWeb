export const durationList = ["Daily", "Weekly", "Monthly", "Quaterly", "Yearly", "FromTo"];

export const colors = ['#003f5c', '#ff7c43', '#665191', '#f95d6a', '#2f4b7c'];

export const themes = {
    defaultTheme: {
        chart: {
            backgroundColor: '#fff',
        },
        xAxis: {
            title: {
                style: {
                    color: '#666666'
                }
            },
            lineColor: "#666666",
            tickColor: "#666666",
            labels: {
                style: {
                    color: '#666666'
                }
            }
        },
        yAxis: {
            gridLineColor: '#e6e6e6',
            title: {
                style: {
                    color: '#666666'
                }
            },
            lineColor: "#666666",
            tickColor: "#666666",
            labels: {
                style: {
                    color: '#666666'
                }
            }
        },
        legend: {
            itemStyle: {
                color: "#333"
            }
        }

    },
    darkTheme: {
        chart: {
            backgroundColor: '#1f2d40',
        },
        xAxis: {
            title: {
                style: {
                    color: '#fff'
                }
            },
            lineColor: "#fff",
            tickColor: "#fff",
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            gridLineColor: '#fff',
            title: {
                style: {
                    color: '#fff'
                }
            },
            lineColor: "#fff",
            tickColor: "#fff",
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        legend: {
            itemStyle: {
                color: "#fff"
            }
        }
    }
};

export const deductChartHghtBy = 68;

export const sizeList = [
    {
        sizeId: 1,
        height: "33.33",
        width: "25"
    },
    {
        sizeId: 2,
        height: "33.33",
        width: "50"
    },
    {
        sizeId: 3,
        height: "33.33",
        width: "75"
    },
    {
        sizeId: 4,
        height: "33.33",
        width: "100"
    },
    {
        sizeId: 5,
        height: "66.66",
        width: "66.66"
    },
    {
        sizeId: 6,
        height: "66.66",
        width: "75"
    },
    {
        sizeId: 7,
        height: "66.66",
        width: "100"
    },
    {
        sizeId: 8,
        height: "99.99",
        width: "100"
    }
]

export const viewList = [
    {
        dValue: "LINE",
        value: "line"
    },
    {
        dValue: "PIE",
        value: "pie"
    },
    {
        dValue: "DONUT",
        value: "donut"
    },
    {
        dValue: "GAUGE",
        value: "gauge"
    },
    {
        dValue: "SOLIDGAUGE",
        value: "solidgauge"
    },
    {
        dValue: "BAR",
        value: "bar"
    },
    {
        dValue: "COLUMN",
        value: "column"
    }];

export const IndicatorsAs = {
    Independent: "Independent",
    IndeCommonData: "IndeCommonData",
    RelCommonData: "RelCommonData",
    MasterDetail: "MasterDetail",
};

// Risk List
export const RiskDisplayNameList = [
    "Location Risk",
    "Government Risk",
    "Climate Risk",
    "Logistic Risk",
    "Trend Risk",
    "Geo Risk",
    "Pricing Risk",
    "Business Risk",
    "Transport Risk",
    "Lifing Risk"
]

// Dashboard Names
export const DashboardNamesList = {
    DemandSupplyForecast: "Demand_Supply_Forecast",
    DemandSupplyGap: "Demand_Supply_Gap",
    SupplyRiskAssessment: "Supply_Risk_Assessment",
    SupplyChainPart: "Supply_Chain_Part",
    SupplyChainSupplierDetail: "Supply_Chain_Supplier_Detail",
    RiskProfile: "Risk_Profile",
    RiskTrend: "Risk_Trend",
    RiskForecast: "Risk_Forecast"
}

// Combo Indicator Filters
export const FilterNameList = {
    QuantityCost: "quantitycost",
    Information: "information",
    RiskText: "risktext",
    DataView: "dataview",
    RiskFactor: "RiskFactor",
    SupplierCompare: "supplierCompare",
    RarEsFsQs: "RARESFSQS",
    Sort: "sort",
    Back: "back",
    Reset: "reset",
    Export: "export"
}

// Dashboard Indicator Names
export const IndicatorNameList = {
    Risk_Trend: [
        { dispalyOrder: 1, name: "SupplierDAM" },
        { dispalyOrder: 2, name: "SupplierRAREFQ" },
        { dispalyOrder: 3, name: "SupplierList" }
    ],
    Risk_Profile: [
        { dispalyOrder: 1, name: "SupplierByDAM" },
        { dispalyOrder: 2, name: "SupplierRiskProfile" },
        { dispalyOrder: 3, name: "DAMVariance" },
        { dispalyOrder: 4, name: "OpenOrdersAtRisk" }
    ],
    Risk_Forecast: [
        { dispalyOrder: 1, name: "Risk_Forecast_W1" },
        { dispalyOrder: 2, name: "Risk_Forecast_W2" }
    ],
    Supply_Chain_Supplier_Detail: [
        { dispalyOrder: 1, name: "SupplierDRI" },
        { dispalyOrder: 2, name: "SupplierReliability" },
        { dispalyOrder: 3, name: "SupplierReponsiveness" },
        { dispalyOrder: 4, name: "SupplierAgility" },
        { dispalyOrder: 5, name: "SupplierRisk" },
        { dispalyOrder: 6, name: "SpenOnOrderByBuyer" },
        { dispalyOrder: 7, name: "QuantityOnOrderByBuyer" },
        { dispalyOrder: 8, name: "QuantityCostAtRisk" },
        { dispalyOrder: 9, name: "OrdersInComingDay" },
        { dispalyOrder: 10, name: "ItemsAtRisk" },
        { dispalyOrder: 11, name: "ItemsDeliveredOnTime" }
    ],
    Supply_Chain_Platform: [
        { dispalyOrder: 1, name: "Top5Platform" },
        { dispalyOrder: 2, name: "Top5WeakPlatform" },
        { dispalyOrder: 3, name: "PlatformRecommendations" }
    ],
    Supply_Chain_Product_Family: [
        { dispalyOrder: 1, name: "Top5ProductFamily" },
        { dispalyOrder: 2, name: "Top5WeakProductFamily" },
        { dispalyOrder: 3, name: "ProductFamilyRecommendations" }
    ],
    Demand_Supply_Forecast: [
        { dispalyOrder: 1, name: "DemandForecastTrend" },
        { dispalyOrder: 2, name: "SupplyForecastTrend" },
        { dispalyOrder: 3, name: "DemandSupplyForecastTrend" },
        { dispalyOrder: 4, name: "DemandSupplyForecastTrendTable" }
    ],
    Supply_Chain_Part: [
        { dispalyOrder: 1, name: "Top5Parts" },
        { dispalyOrder: 2, name: "Top5WeakParts" },
        { dispalyOrder: 3, name: "AlternateSupplier" },
        { dispalyOrder: 4, name: "Top5PartsTrend" }
    ],
    Supply_Chain_Supplier: [
        { dispalyOrder: 1, name: "Top5Suppliers" },
        { dispalyOrder: 2, name: "Top5WeakSuppliers" },
        { dispalyOrder: 3, name: "SupplierRecommendations" },
        { dispalyOrder: 4, name: "Top5SupplierTrend" }
    ],
    Supply_Risk_Assessment: [
        { dispalyOrder: 1, name: "SupplyRiskAssessment" }
    ],
    Demand_Supply_Gap: [
        { dispalyOrder: 1, name: "DemandSupplyGapTrend" }
    ]
}

// name param type list
export const nameParamType = {
    TenantID: "@TenantID",
    TimeSpan: "@TimeSpan",
    SupplierID: "@SupplierID",
    BuyerID: "@BuyerID",
    WidgetName: "@WidgetName",
    PO: "@PO",
    Commodity: "@Commodity",
    POLineNum: "@POLineNum",
    PN: "@PN",
    calculateAs: "@calculateAs",
    Part: "@Part",
    MagnitudeOfUnit: "@MagnitudeOfUnit",
    DurationUnit: "@DurationUnit",
    fetchHistory: "@fetchHistory",
    startDatePara: "@startDatePara",
    endDatePara: "@endDatePara"
}